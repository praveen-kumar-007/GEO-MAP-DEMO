import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
    placeName: {
        type: String,
        required: true
    },
    roadName: {
        type: String,
        default: ''
    },
    landmark: {
        type: String,
        default: ''
    },
    latitude: {
        type: Number,
        default: 0
    },
    longitude: {
        type: Number,
        default : 0
    },
    shapeType: {
        type: String,
        enum: ['Point', 'Straightline', 'Polygon'],
        required: true
    },
    area : {
        type: Number,
        default: 0
    },
    length: {
        type: Number,
        default: 0
    },
    unit: {
        type: String,
        default: 'meters'
    },
    coordinates: {
        type: mongoose.Schema.Types.Mixed,
        default : []
    },

}, { timestamps: true });


const Feature = mongoose.model('Feature', featureSchema);

export default Feature;