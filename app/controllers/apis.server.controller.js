'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Candidate = mongoose.model('Candidate'),
	School = mongoose.model('School'),
	Faculty = mongoose.model('Faculty'),
	_ = require('lodash');


/**
 * Api middleware
 */
exports.apiByID = function(req, res, next, id) { 
	// Api.findById(id).populate('user', 'displayName').exec(function(err, api) {
		// if (err) return next(err);
		// if (! api) return next(new Error('Failed to load Api ' + id));
		req.api.id = id ;
		next();
	// });
};

/**
 * Api authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.api.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

/**
 * Query of Apis
 */
var facultyFull;
 Faculty.find().exec(function(err, faculty) {
	////console.log(err, faculty);
	facultyFull = faculty;
});
var schoolAll;
School.find().exec(function(err, school) {
	schoolAll = school ;
});
exports.opportunity = function(req, res) { 
	// create_faculty_list();
	console.log(_.has(req.body, 'subject_group'), _.has(req.body, 'score'));
	if(_.has(req.body, 'subject_group') && _.has(req.body, 'score')){

		var subject1 = req.body.subject_group.subject1;
		var subject2 = req.body.subject_group.subject2;
		var subject3 = req.body.subject_group.subject3;

		var shuffle = shuffle_func(subject1, subject2, subject3);

		var score_priority = req.body.score.score_priority;
		var score_1 = req.body.score.score_1;
		var score_2 = req.body.score.score_2;
		var score_3 = req.body.score.score_3;

		var faculty_array = [];
		for(var s_index in shuffle){

			var faculty = _.remove(facultyFull, function(object) {
				return object.subject_group.indexOf(shuffle[s_index]) === -1;
			});

			var faculty_code = _.map(faculty, function (object) {
				return object.school_code +'-'+object.code;
			});
			faculty_array = faculty_array.concat(faculty_code);
		}
		var faculty_condition =  _.uniq(faculty_array);
		
		res.jsonp(faculty_condition);
		var condition_score = score_priority + score_1 + score_2 + score_3;
			//console.log(shuffle_facultys);
		Candidate.aggregate(
	  	{ $match : {school_faculty : {$in : shuffle_facultys},  score_final: { $gt: condition_score  } } }, 
		{ $group: { _id: { school_code:  "$school_code" , faculty_code:  "$faculty_code" } , total: { $sum: 1}}}, 
		{ $project: { _id: 1, total: 1 , school_faculty: { $concat: [ "$_id.school_code", "-", "$_id.faculty_code" ] }}}
		  //, { $project: { itemDescription: { $concat: [ "$item", " - ", "$description" ] } } }
		  , function (err, logs) {
		  	if (err) {
			  	//console.log(err);
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {

				var school = [];
				for (var i in logs) {

					for (var x = 0; 
						x < facultyFull.length && (
							facultyFull[x].code !== logs[i]._id.faculty_code 
							&& facultyFull[x].school_code !== logs[i]._id.school_code
							); x++) {};
						
					if(facultyFull[x] === undefined){
						//console.log(logs[i]);
					}
					if(facultyFull[x] !== undefined && parseInt(logs[i].total) < parseInt(facultyFull[x].quota)){
						logs[i].faculty = facultyFull[x];
						// for (var x = 0; x < schoolAll.length && schoolAll[x].code !== logs[i]._id.school_code; x++) {};
						// logs[i].school = schoolAll[x];
						school.push(logs[i]);
					}
					
				};
				res.jsonp(school);
			}
		});

	}
	
	// for (var i in facultyFull) {
	// 	// var facultyFull
	// 	var faculty = facultyFull[i];
	// 	Candidate.aggregate([
	// 	    { $project: {
	// 	    	student_name:1,
	// 	    	student_id:1,
	// 	    	school_code:1,
	// 	    	faculty_code:1,
	// 	    	subject_group: 1,
	// 	    	priority: 1,		    	
	// 	        score_sum: 1,
	// 	        score_priority: 1,
	// 	        score_total: {$add: ['$score_sum', '$score_priority']}}},

	// 	    // Filter the docs to just those where sum < 20
	// 	    { $match: {
	// 	    	school_code: {$eq : faculty.school_code} , 
	// 	    	faculty_code: {$eq : faculty.code}  ,
	// 	    	score_total: {$gte: req.body.score.score_sum}
	// 	    }},
	// 	], function(err, result) {
	// 	});
	// };
// }
	// create_matriculate_list(req.body.score);
	// Faculty.find({
	// 	subject_group: { $in: shuffle },
		
	// }).exec(function(err, facultys) {
	// 	if (err) {
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {

	// 		//res.jsonp(facultys); subject_group: { $in: shuffle },

	// 		var shuffle_facultys = [];
	// 		for (var i in facultys) {
	// 			shuffle_facultys.push(facultys[i].school_code + '-' + facultys[i].code);
	// 		}
	

	// 	}
	// });

	// Candidate.aggregate()
	//   .group({ _id: "$school_code", total: { $sum: 1 } })
	//   .select('-id total')
	//   .exec(function (err, logs) {
	//     // if (err) return handleError(err);
	//     // //console.log(res); // [ { maxBalance: 98 } ]
	//     if (err) {
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		res.jsonp(logs);
	// 	}
	// });
		
	
};

function shuffle_func (subject1, subject2, subject3) {
	var shuffle = [];
	shuffle.push(subject1+'-'+subject2+'-'+subject3);
	shuffle.push(subject1+'-'+subject3+'-'+subject2);
	shuffle.push(subject2+'-'+subject1+'-'+subject3);
	shuffle.push(subject2+'-'+subject3+'-'+subject1);
	shuffle.push(subject3+'-'+subject1+'-'+subject2);
	shuffle.push(subject3+'-'+subject2+'-'+subject1);
	return shuffle;	
};


/**
 * matriculate a Api
 */

exports.domatriculate = function(req, res) {
	if(_.has(req.body, 'school')){
		// initialization.run_matriculate(req.body.school, res);
		var matriculate = require('../../app/controllers/api/matriculate');
		matriculate.init(req.body.school, res, facultyFull);
	}else{
		res.jsonp({
			result:false, 
			message:'Quá trình xử lý có một vấn đề. Vui lòng thử lại sau!'
		});
	}
	//school
}
/**
 * matriculate a Api
 */

exports.initialization = function(req, res) {
	if(_.has(req.body, 'school')){
		// initialization.run_matriculate(req.body.school, res);
		var initialization = require('../../app/controllers/api/initialization');
		initialization.init(req.body.school, res, facultyFull);
	}else{
		res.jsonp({
			result:false, 
			message:'Quá trình xử lý có một vấn đề. Vui lòng thử lại sau!'
		});
	}
	//school
}
exports.viewschool = function(req, res) {
	if(_.has(req.body, 'school')){
		Faculty
		.find({school_code : req.body.school})
		.exec(function(err, faculties) {
			if (err) {
				res.jsonp({
					result:false, 
					message:err.toString()
				});
			} else {
				res.jsonp({
					result:true, 
					record: faculties,
					message:''
				});
			}
		});
	}else{
		res.jsonp({
			result:false, 
			message:'Quá trình xử lý có một vấn đề. Vui lòng thử lại sau!'
		});
	}
	//school
}
exports.viewfaculty = function(req, res) {
	if(_.has(req.body, 'school')){
		Faculty
		.find({school_code : req.body.school},{candidate_apply:0, candidate_check: 0, school_name : 0})
		.exec(function(err, faculties) {
			if (err) {
				res.jsonp({
					result:false, 
					message:err.toString()
				});
			} else {
				for(var x_index in faculties){
					faculties[x_index].matriculate = _.size(faculties[x_index].matriculate_list);//.length
					//faculties[x_index].candidate = _.size(faculties[x_index].candidate_apply);//.length
				}
				res.jsonp({
					result:true, 
					record: faculties,
					message:''
				});
			}
		});
	}else{
		res.jsonp({
			result:false, 
			message:'Quá trình xử lý có một vấn đề. Vui lòng thử lại sau!'
		});
	}
	//school
}
exports.findcandidates = function(req, res) {
	// console.log(rep.body.conditions)
	var conditions = {'$and' : [{faculty_code:{'$ne' : null}},{faculty_code:{'$ne' : ""}}]};
	if(_.has(req.body, 'conditions')){
		console.log(req.body.conditions)
		conditions = {};
		for(var c_index in req.body.conditions){
			if(req.body.conditions[c_index].type === 'school'){
				conditions = _.extend(conditions,{school_code : req.body.conditions[c_index].value});
			}
			if(req.body.conditions[c_index].type === 'faculty'){
				conditions = _.extend(conditions,{faculty : req.body.conditions[c_index].value});
			}
			if(req.body.conditions[c_index].type === 'priority'){
				conditions = _.extend(conditions,{priority : req.body.conditions[c_index].value});
			}
			if(req.body.conditions[c_index].type === 'subjectgroup'){
				var arr = req.body.conditions[c_index].value.split("-");
				var group = shuffle_func(arr[0],arr[1],arr[2]);
				conditions = _.extend(conditions,{subject_group : {'$in':group}});
			}
		}
	}
	if(_.has(req.body, 'query')){
		console.log(req.body.query)
		 var regex = new RegExp(req.body.query, "i");
		conditions = _.extend(conditions,{'$or':[{student_id : regex},{student_name : regex}]});
	}
	console.log(conditions);
	var nPerPage = 50;
	var pageNumber = 0;
	if(_.has(req.body, 'pagination_active')){
		pageNumber = req.body.pagination_active;
	}
	Candidate
		.count(conditions)
		.exec(function(err, count_faculties) {
			if (err) {
				res.jsonp({
					result:false, 
					message:err.toString()
				});
			} else {
	//.count
		Candidate
		.find(conditions,{score_1:0, score_2: 0, score_3 : 0})
		.skip(pageNumber > 1 ? ((pageNumber-1)*nPerPage) : 0).limit(nPerPage)
		.limit(nPerPage)
		.sort('-score_final')
		.exec(function(err, faculties) {
			if (err) {
				res.jsonp({
					result:false, 
					message:err.toString()
				});
			} else {
				var record = [];
				for (var x_index = 0; x_index < faculties.length; x_index++) {
				// 	Things[i]
				// };
				// for(var x_index = 0 ; in faculties){
					var faculty_choice =  _.uniq(_.filter(facultyFull, function(object) {
					  return object.code === faculties[x_index].faculty;
					}));
					var school_choice =  _.uniq(_.filter(schoolAll, function(object) {
					  return object.code === faculties[x_index].school_code;
					}));
					var faculty = faculties[x_index].faculty
					var school_code = faculties[x_index].school_code
					if(faculty_choice.length > 0){
						faculty = faculty_choice[0].name;
					}
					if(school_choice.length > 0){
						school_code = school_choice[0].name;
					}
					//console.log(faculty_choice[0].name)
						record.push({
							faculty : faculty,
							school_code: school_code,
							subject_group: faculties[x_index].subject_group,
							student_name: faculties[x_index].student_name,
							student_id: faculties[x_index].student_id,
							faculty_code: faculties[x_index].faculty_code,
							score_final: faculties[x_index].score_final,
							score_priority: faculties[x_index].score_priority,
							priority: faculties[x_index].priority
						});
					// record.push(faculties[x_index]);
				// 	faculties[x_index].matriculate = _.size(faculties[x_index].matriculate_list);//.length
				// 	faculties[x_index].candidate = _.size(faculties[x_index].candidate_apply);//.length
				}
				res.jsonp({
					result:true, 
					record: record,
					//length: count_faculties/50,//Candidate.where(conditions).count(),
					length: _.ceil(count_faculties/50),/// > 20 ? 21 : _.ceil(count_faculties/50),//Candidate.where(conditions).count(),
					pagination_active: pageNumber,
					message:''
				});
			}
		});
			}
		});
	// }else{
	// 	res.jsonp({
	// 		result:false, 
	// 		message:'Quá trình xử lý có một vấn đề. Vui lòng thử lại sau!'
	// 	});
	// }
	//school
}
exports.matriculate = function(req, res) {
	var school_code = 'QSC';
	Candidate.aggregate( [ 
		{ $match : {school_code : 'DDK'}},
		{ $group : { _id : {faculty_code:  "$faculty_code", } } } ,
		{ $project: { _id: 1, school_code:1, faculty_code: "$_id.faculty_code"}},
		], 
		function (err, logs) {  
	  	if (err) {
		  	console.log(err);
		} else {
			console.log(_.pluck(logs, 'faculty_code'));
			
		}
	}
	);
	
};





