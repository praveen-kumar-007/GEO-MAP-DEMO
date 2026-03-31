import Feature from "../models/Features.model.js";
export const createFeature = async (req, res) => {
    try {
        const { placeName, roadName, landmark, latitude, longitude, shapeType, coordinates, area, length } = req.body;
        if (!placeName || !shapeType) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const feature = new Feature({
            placeName,
            roadName,
            landmark,
            latitude,
            longitude,
            shapeType,
            area : area || 0,
            length : length  || 0,
            unit: 'meters',
            coordinates : coordinates || []
        })
        await feature.save();
        res.status(201).json(feature);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllFeatures = async (req, res) => {
    try {
        const features = await Feature.find().sort({ createdAt: -1 });
        res.status(200).json(features);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteFeature = async(req, res) => {
    try {
        const { id } = req.params;
        const feature = await Feature.findByIdAndDelete(id);
        if (!feature) {
            return res.status(404).json({ message: 'Feature not found' });
        }
        res.status(200).json({ message: 'Feature deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}