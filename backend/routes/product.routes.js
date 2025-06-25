const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Car, Accessory } = require('../models/Product');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Serve static files from uploads directory
router.use('/uploads', express.static('uploads'));

// Car Routes
router.get('/cars', async (req, res) => {
    try {
        const cars = await Car.findAll();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/cars', upload.single('image'), async (req, res) => {
    try {
        const carData = {
            ...req.body,
            image: req.file ? `/uploads/${req.file.filename}` : null
        };
        const car = await Car.create(carData);
        res.status(201).json(car);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/cars/:id', async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id);
        if (car) {
            res.json(car);
        } else {
            res.status(404).json({ message: 'Car not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/cars/:id', upload.single('image'), async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id);
        if (car) {
            const updateData = {
                ...req.body,
                image: req.file ? `/uploads/${req.file.filename}` : car.image
            };
            await car.update(updateData);
            res.json(car);
        } else {
            res.status(404).json({ message: 'Car not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/cars/:id', async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id);
        if (car) {
            await car.destroy();
            res.json({ message: 'Car deleted successfully' });
        } else {
            res.status(404).json({ message: 'Car not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Accessory Routes
router.get('/accessories', async (req, res) => {
    try {
        const accessories = await Accessory.findAll();
        res.json(accessories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/accessories/:id', async (req, res) => {
    try {
        const accessory = await Accessory.findByPk(req.params.id);
        if (accessory) {
            res.json(accessory);
        } else {
            res.status(404).json({ message: 'Accessory not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/accessories', upload.single('image'), async (req, res) => {
    try {
        const accessoryData = {
            ...req.body,
            image: req.file ? `/uploads/${req.file.filename}` : null
        };
        const accessory = await Accessory.create(accessoryData);
        res.status(201).json(accessory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/accessories/:id', upload.single('image'), async (req, res) => {
    try {
        const accessory = await Accessory.findByPk(req.params.id);
        if (accessory) {
            const updateData = {
                ...req.body,
                image: req.file ? `/uploads/${req.file.filename}` : accessory.image
            };
            await accessory.update(updateData);
            res.json(accessory);
        } else {
            res.status(404).json({ message: 'Accessory not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/accessories/:id', async (req, res) => {
    try {
        const accessory = await Accessory.findByPk(req.params.id);
        if (accessory) {
            await accessory.destroy();
            res.json({ message: 'Accessory deleted successfully' });
        } else {
            res.status(404).json({ message: 'Accessory not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 