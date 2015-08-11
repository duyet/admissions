'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Candidate Schema
 */

var CandidateSchema = new mongoose.Schema({
	student_name: String, // Ho va ten
	student_id: { type: String }, // So bao danh
	school_code: String, // Ma~ truo`ng
	faculty_code: { type: String, default: "" }, // Nga`nh 
	faculty: { type: String, default: "" }, // Nga`nh (ma~ go^'c) 
	subject_group: String,
	priority: { type: Number, default: 0 }, // So thu tu nguyen vong uu tien
	score_1 : { type: Number, default: 0 }, // Diem mon 1
	score_2 : { type: Number, default: 0 }, // Diem mon 2
	score_3 : { type: Number, default: 0 }, // Diem mon 3
	score_priority: { type: Number, default: 0 }, // Diem uu tien
	score_sum : { type: Number, default: 0 }, // Tong so diem
	score_final : { type: Number, default: 0 }, // Tong so diem
	
	created: { type: Date },
	lasted_update: { type: Date },

});
CandidateSchema.index({student_id: 1, faculty_code: 1}, {unique: true});


mongoose.model('Candidate', CandidateSchema);

