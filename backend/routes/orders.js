const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

console.log('Orders router loaded');

// Import Sequelize Models
const DeliveryAddress = require('../models/DeliveryAddress');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const { Car, Accessory } = require('../models/Product');
const Service = require('../models/Service');

// Function to fetch product price securely using Sequelize models
async function getProductDetails(productId, source) {
    let model;
    let details = null;

    try {
        if (source === 'cars') {
            model = Car;
        } else if (source === 'accessories') {
            model = Accessory;
        } else if (source === 'memberships') {
            model = Service;
        } else {
            return null;
        }

        details = await model.findByPk(productId, { attributes: ['id', 'price'] });
        return details ? details.toJSON() : null;

    } catch (error) {
        console.error(`Error fetching details for product ${productId} (${source}):`, error);
        throw new Error(`Could not fetch details for product ${productId}`);
    }
}

// POST /api/orders - Endpoint to create a new order
router.post('/', authenticateToken, async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { deliveryInfo, carts } = req.body;
        console.log('Creating order with data:', { deliveryInfo, carts, userId: req.user.id });

        // Calculate total amount
        let totalAmount = 0;
        for (const item of carts) {
            const productDetails = await getProductDetails(item.productId, item.source);
            if (!productDetails) {
                throw new Error(`Product with ID ${item.productId} (${item.source}) not found`);
            }
            totalAmount += productDetails.price * item.quantity;
        }

        // Add delivery fee
        const deliveryFee = totalAmount > 0 ? 5 : 0;
        totalAmount += deliveryFee;

        console.log('Calculated total amount:', totalAmount);

        // Create order in database
        const order = await Order.create({
            user_id: req.user.id,  // Use user_id instead of userId
            total_amount: totalAmount,  // Use total_amount instead of totalAmount
            status: 'pending',
            deliveryName: deliveryInfo.name,
            deliveryAddress: deliveryInfo.address,
            deliveryCity: deliveryInfo.city,
            deliveryCountry: deliveryInfo.country,
            deliveryPhone: deliveryInfo.phone,
        }, { transaction: t });

        console.log('Created order:', order.id);

        // Create order items
        const orderItems = await Promise.all(carts.map(async (item) => {
            const productDetails = await getProductDetails(item.productId, item.source);
            return OrderItem.create({
                order_id: order.id,  // Use order_id instead of orderId
                product_id: item.productId,  // Use product_id instead of productId
                product_source: item.source,  // Use product_source instead of productSource
                quantity: item.quantity,
                price: productDetails.price,
            }, { transaction: t });
        }));

        await t.commit();

        // Fetch product names for email
        const itemsWithNames = await Promise.all(carts.map(async (item) => {
            let productName = 'Product';
            if (item.source === 'cars') {
                const car = await Car.findByPk(item.productId);
                productName = car ? car.name : 'Car';
            } else if (item.source === 'accessories') {
                const accessory = await Accessory.findByPk(item.productId);
                productName = accessory ? accessory.name : 'Accessory';
            }
            return {
                productName,
                quantity: item.quantity,
                price: item.price
            };
        }));

        // Send confirmation email
        // await sendOrderConfirmation(
        //     req.user.email, // Make sure user email is available in req.user
        //     order.id,
        //     itemsWithNames
        // );

        // Return success response
        res.status(201).json({
            message: 'Order created successfully!',
            orderId: order.id
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            message: 'Failed to create order',
            error: error.message
        });
    }
});

// GET /api/orders - Endpoint to fetch orders for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
    try {
        console.log('Fetching orders for user:', req.user.id);

        const orders = await Order.findAll({
            where: {
                user_id: req.user.id
            },
            include: [{
                model: OrderItem,
                as: 'items',
                attributes: ['product_id', 'product_source', 'quantity', 'price'],
                include: [
                    { model: Car, as: 'carDetails', attributes: ['name'], required: false },
                    { model: Accessory, as: 'accessoryDetails', attributes: ['name'], required: false },
                    { model: Service, as: 'serviceDetails', attributes: ['name'], required: false }
                ]
            }],
            order: [['order_date', 'DESC']]  // Fixed: using order_date instead of createdAt
        });

        console.log('Raw orders fetched from DB:', orders.map(order => order.toJSON())); // Log raw data

        // Format the orders to include product names
        const formattedOrders = orders.map(order => ({
            id: order.id,
            totalAmount: order.total_amount,
            status: order.status,
            orderDate: order.order_date,
            items: order.items.map(item => {
                let productName = 'Unknown Product';
                if (item.product_source === 'cars' && item.carDetails) {
                    productName = item.carDetails.name;
                } else if (item.product_source === 'accessories' && item.accessoryDetails) {
                    productName = item.accessoryDetails.name;
                } else if (item.product_source === 'memberships' && item.serviceDetails) {
                    productName = item.serviceDetails.name;
                }

                return {
                    productId: item.product_id,
                    productSource: item.product_source,
                    productName: productName,
                    quantity: item.quantity,
                    price: item.price
                };
            })
        }));

        console.log(`Found ${orders.length} orders for user ${req.user.id}`);
        res.status(200).json(formattedOrders);

    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            message: 'Failed to fetch user orders',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// GET /api/orders/dashboard - Endpoint for dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        console.log('Fetching dashboard data...');

        // Calculate Total Sales - Sum of all orders' total_amount
        console.log('Calculating total sales...');
        const totalSalesResult = await Order.sum('total_amount', {
            where: {
                status: 'delivered'  // Changed from 'completed' to 'delivered'
            }
        });
        const totalSales = totalSalesResult || 0;
        console.log(`Total Sales: ${totalSales}`);

        // Count Pending Orders
        console.log('Counting pending orders...');
        const pendingOrdersCount = await Order.count({
            where: {
                status: 'pending'
            }
        });
        console.log(`Pending Orders: ${pendingOrdersCount}`);

        // Count Completed Orders
        console.log('Counting completed orders...');
        const completedOrdersCount = await Order.count({
            where: {
                status: 'delivered'  // Changed from 'completed' to 'delivered'
            }
        });
        console.log(`Completed Orders: ${completedOrdersCount}`);

        // Get Total Products Sold
        console.log('Calculating total products sold...');
        const productsSoldResult = await OrderItem.sum('quantity', {
            include: [{
                model: Order,
                attributes: [],
                where: {
                    status: 'delivered'  // Changed from 'completed' to 'delivered'
                }
            }],
            raw: true
        });
        const productsSoldCount = productsSoldResult || 0;
        console.log(`Total Products Sold: ${productsSoldCount}`);

        // Get Recent Orders with their items and product details
        console.log('Fetching recent orders with product details...');
        const recentOrders = await Order.findAll({
            attributes: ['id', 'total_amount', 'status', 'order_date'],
            include: [{
                model: OrderItem,
                as: 'items',
                attributes: ['product_id', 'product_source', 'quantity', 'price'],
                include: [
                    { model: Car, as: 'carDetails', attributes: ['name'], required: false },
                    { model: Accessory, as: 'accessoryDetails', attributes: ['name'], required: false },
                    { model: Service, as: 'serviceDetails', attributes: ['name'], required: false }
                ]
            }],
            order: [['order_date', 'DESC']],
            limit: 5
        });

        // Calculate Revenue by Product Type
        console.log('Calculating revenue by product type...');
        const carRevenue = await OrderItem.sum('price', {
            where: {
                product_source: 'cars'
            },
            include: [{
                model: Order,
                attributes: [],
                where: {
                    status: 'delivered'  // Changed from 'completed' to 'delivered'
                }
            }],
            raw: true
        });
        console.log(`Car Revenue: ${carRevenue}`);

        const accessoryRevenue = await OrderItem.sum('price', {
            where: {
                product_source: 'accessories'
            },
            include: [{
                model: Order,
                attributes: [],
                where: {
                    status: 'delivered'  // Changed from 'completed' to 'delivered'
                }
            }],
            raw: true
        });
        console.log(`Accessory Revenue: ${accessoryRevenue}`);

        // Format the response with product names
        console.log('Formatting response with product names...');
        const formattedRecentOrders = recentOrders.map(order => {
            console.log('Order total_amount:', order.total_amount);
            return {
                id: order.id,
                totalAmount: order.total_amount,
                status: order.status,
                createdAt: order.order_date,
                items: Array.isArray(order.items) ? order.items.map(item => {
                    let productName = 'Unknown Product';
                    if (item.product_source === 'cars' && item.carDetails) {
                        productName = item.carDetails.name;
                    } else if (item.product_source === 'accessories' && item.accessoryDetails) {
                        productName = item.accessoryDetails.name;
                    } else if (item.product_source === 'memberships' && item.serviceDetails) {
                        productName = item.serviceDetails.name;
                    }

                    return {
                        productId: item.product_id,
                        productSource: item.product_source,
                        productName: productName,
                        quantity: item.quantity,
                        price: item.price
                    };
                }) : []
            };
        });

        const response = {
            totalSales: totalSales,
            pendingOrdersCount: pendingOrdersCount,
            completedOrdersCount: completedOrdersCount,
            productsSoldCount: productsSoldCount,
            recentOrders: formattedRecentOrders,
            revenueByType: {
                cars: carRevenue || 0,
                accessories: accessoryRevenue || 0
            }
        };

        console.log('Sending dashboard response:', response);
        res.json(response);

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({
            message: 'Error fetching dashboard data',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// PUT /api/orders/:orderId/status - Update order status
router.put('/:orderId/status', authenticateToken, async (req, res) => {
    console.log('Received PUT request for order status update:', {
        orderId: req.params.orderId,
        status: req.body.status,
        user: req.user,
        body: req.body
    });

    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) {
            console.error('Status is missing in request body');
            return res.status(400).json({ message: 'Status is required' });
        }

        // Map 'completed' to 'delivered' since that's what we have in the ENUM
        const mappedStatus = status === 'completed' ? 'delivered' : status;

        // Find the order
        const order = await Order.findByPk(orderId);
        if (!order) {
            console.log('Order not found:', orderId);
            return res.status(404).json({ message: 'Order not found' });
        }

        console.log('Found order:', {
            id: order.id,
            currentStatus: order.status,
            newStatus: mappedStatus
        });

        // Update the status
        order.status = mappedStatus;
        await order.save();

        console.log('Order updated successfully:', {
            id: order.id,
            status: order.status
        });

        // Return the updated order
        res.json({
            message: 'Order status updated successfully',
            order: {
                id: order.id,
                status: order.status,
                totalAmount: order.total_amount,
                createdAt: order.order_date
            }
        });
    } catch (error) {
        console.error('Error updating order status:', {
            error: error.message,
            stack: error.stack,
            orderId: req.params.orderId,
            status: req.body.status
        });
        res.status(500).json({
            message: 'Error updating order status',
            error: error.message
        });
    }
});

// Handle OPTIONS request for the status update endpoint
router.options('/:orderId/status', (req, res) => {
    console.log('Received OPTIONS request for order status update');
    res.header('Access-Control-Allow-Methods', 'PUT, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end();
});

// Add a test route to verify the router is working
router.get('/test', (req, res) => {
    console.log('Test route hit');
    res.json({ message: 'Orders router is working' });
});

// Export the router
module.exports = router;