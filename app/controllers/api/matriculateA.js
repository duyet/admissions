'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
	Candidate = mongoose.model('Candidate'),
	School = mongoose.model('School'),
	Faculty = mongoose.model('Faculty'),
	_ = require('lodash');

module.exports = function (school) {
	var school = school;
	var faculties = [];
	var faculties_final = [];
	var candidate_final = [];
	console.log(' benchmark school : ', school);
	function init_mix_max (callback) {
		Candidate
		.find({school_code : school},{score_final : 1})
		.sort('score_final')
		.limit(1)
		.exec(function(err, min) {
			
			if (err) {

			// 	res.jsonp({
			// 		result:false, 
			// 		message:err.toString()
			// 	});
			} else {
				Candidate
				.find({school_code : school},{score_final : 1})
				.sort('-score_final')
				.limit(1)
				.exec(function(err, max) {
					
					if (err) {
					// 	res.jsonp({
					// 		result:false, 
					// 		message:err.toString()
					// 	});
					} else {
						
						Faculty.find().sort('-created')
						// .populate('user', 'displayName')
						.exec(function(err, faculties) {
							if (err) {
								// return res.status(400).send({
								// 	message: errorHandler.getErrorMessage(err)
								// });
							} else {
								//res.jsonp(faculties);
								console.log('min_benchmark', min, max);
								faculties = faculties;
								callback(min.score_final, max.score_final, faculties);
							}
						});
					}
				});
			}
		});

	}
	init_mix_max(function (min, max, faculties) {
		get_candidate (min, max, faculties);
	})
	function get_candidate (min, max, faculties) {
		var average = _.ceil((min+max)/2);
		Candidate
		.find({school_code : school, score_final : {$gte : average}},
			{score_final : 1, student_id : 1, faculty : 1, }
		)
		.sort('-score_final')
		// .limit(1)
		.exec(function(err, candidates) {
			
			if (err) {
			// 	res.jsonp({
			// 		result:false, 
			// 		message:err.toString()
			// 	});
			} else {
				console.log('get candidate', candidates.length);
				callback(min.score_final, max.score_final);
			}
		});
	}
	function remove_same_priority (candidates_query) {
		var list_same = [];

		var candidate_uniq = _.pluck(_.uniq(candidates_query, 'student_id'),'student_id');

		for(var x_index in candidate_uniq){
			var same = _.filter(candidates_query, function(object) {
			  return object.student_id === candidate_uniq[x_index];
			});

			if(same.length > 1){
				same = _.sortBy(same, 'priority');
				same.shift();
				var pluck_same = _.pluck(same, '_id');
				list_same = list_same.concat(pluck_same);
			}
		}

		var candidates = _.remove(candidates_query, function(object) {
			return list_same.indexOf(object._id) != -1;
		});
		console.log('remove_same_priority: ', candidates_query.length ,candidates.length);
		return candidates;
	}
	function set_candidates_faculty (faculties, candidates) {
		console.log('set_candidates_faculty');
		for(var y_index in faculties){
			var candidate_faculty = _.filter(candidates, function(object) {
			  return object.faculty === faculties[y_index].code;
			});
			candidate_choice = _.sortByOrder(candidate_faculty, ['score_final'],['desc']);
			var candidate_chunk =  _.chunk(candidate_choice, 
					faculties[y_index].quota 
					- faculties[y_index].current
				);
			var faculty_candidate = candidate_chunk[0];

			faculties[y_index].current += faculty_candidate.length;											
			faculties[y_index].matriculate_list = faculties[y_index].matriculate_list.concat(faculty_candidate);
			if(faculty_candidate.length > 0){
				faculties[y_index].benchmark = faculty_candidate[faculty_candidate.length -1].score_final
			}
		}
	}
	function get_min_benchmark (faculties, candidates) {
		console.log('get_min_benchmark');
		var benchmark = [];
		for(var y_index in faculties){
			var candidate_faculty = _.filter(candidates, function(object) {
			  return object.faculty === faculties[y_index].code;
			});
			candidate_choice = _.sortByOrder(candidate_faculty, ['score_final'],['desc']);
			var candidate_chunk =  _.chunk(candidate_choice, 
					faculties[y_index].quota 
					- faculties[y_index].current
				);
			var faculty_candidate = candidate_chunk[0];

			// faculties[y_index].current += faculty_candidate.length;											
			// faculties[y_index].matriculate_list = faculties[y_index].matriculate_list.concat(faculty_candidate);
			if(faculty_candidate.length > 0){
				benchmark.push({benchmark : faculty_candidate[faculty_candidate.length -1].score_final});
				///faculties[y_index].benchmark = faculty_candidate[faculty_candidate.length -1].score_final
			}
		}
		var pluck = _.pluck(_.sortByOrder(candidates_query,['benchmark'],['desc']), 'benchmark');
		return 	pluck[0].benchmark;	
	}
	function analytics (min, max, faculties, average, candidates_query) {
		console.log('analytics');
		if(candidates.length > 0){
			//var candidates = this_school.matriculated_list;	
			
			candidates = remove_same_priority (candidates_query);
			var min_benchmark = get_min_benchmark(faculties, candidates);
			if(parseInt(benchmark[0]) > average){
				var candidates_new =  _.filter(candidates, function(object) {
				  return object.score_final >= benchmark[0];
				});
				analytics (min, max, faculties, average, candidates_new);
			}else if(parseInt(benchmark[0]) == average){
				// get_candidate (min, benchmark[0], faculties)
				set_candidates_faculty (faculties, candidates);
				for(var y_index in faculties){
					if(faculties[y_index].quota - faculties[y_index].current === 0){
						faculties_final.push(faculties.code);
					}
				}
				candidate_final = candidate_final.concat(_.pluck(candidates, 'student_id'));
				if(faculties_final.length === faculties.length){

				}
			}

			// if()
			
			
			// var benchmark = _.pluck(_.sortByOrder(candidates_query,['benchmark'],['desc']), 'benchmark');
			
			// _this.remove_candidates_same(this_school.school);	
		}else{
			// _this.save_to_database(this_school.school);	
			//_this.remove_candidates_same(this_school.school);	
		}	
	}
	//save to database
	function save_faculties (faculties) {
		console.log('save_faculties');
		// var this_school = this.get_school(school_code);
		// var _this = this;
		faculty_final = [];
		for(var s_index in faculties){
			faculties[s_index].save(function(err, faculty) {
				if (err) {
					//_this.log(school_code,err.toString());
				} else {
					//_this.log(school_code,'Save -'+faculty.school_code + ' - ' + faculty.code + ' - ' + Date());
					faculty_final.push(faculty.code);
					// this_school.faculty_final = _.uniq(this_school.faculty_final);
					// _this.set_school(this_school);
					if(faculty_final.length >= faculties.length){
						save_school();
						// _this.log_test(school_code,'- save school database : '+faculty.code);
						// _this.log_test(school_code,'- save school database : '+this_school.faculty_final.toString());
						// // save_tothis_school.save_to &&
						// this_school.save_to = false;
						// _this.set_school(this_school);
						// _this.save_school_database(this_school.school);
					}
				}
			});
		}
	},
	//save to database
	function save_school () {
		console.log('save_school');
		// var this_school = this.get_school(school_code);
		// var _this = this;
		//this_school.faculty_final = [];
		// this.log(school_code,'- save school database');
		// School
		// .findOne({code : school})
		// .exec(function(err, school) {
		// 	if (err) {
		// 		// _this.log(school_code,err.toString());
		// 		// _this.res.jsonp({
		// 		// 	result:false, 
		// 		// 	message:err.toString()
		// 		// });
		// 	}else{
		// 		// _this.log(school_code,'- save school success');
		// 		school.faculty_list = _.pluck(faculties, 'code');
		// 		school.quota = this_school.total_quota;
		// 		school.status = 1;
		// 		school.resume = this_school.resume;
		// 		school.matriculated = this_school.matriculated;
		// 		school.candidate = this_school.candidate_all;
		// 		var benchmark = _.pluck(this_school.faculty_choice, 'benchmark');
		// 		if(benchmark.length > 0){
		// 			var benchmark_sort = _.sortBy(benchmark);
		// 			school.largest_benchmark = benchmark_sort[benchmark_sort.length-1];
		// 			school.smallest_benchmark = benchmark_sort[0];
		// 		}
		// 		school.modified = Date();				
		// 		school.save(function(err, result) {
		// 			if (err) {
		// 				_this.log(school_code,err.toString());
		// 				_this.res.jsonp({
		// 					result:false, 
		// 					message:err.toString()
		// 				});
		// 			} else {
		// 				_this.log(school_code,'- save school success final');
		// 				_this.res.jsonp({
		// 					result:true, 
		// 					message:''
		// 				});
		// 				return
		// 			}
		// 		});
		// 	}
		// });
	}
	//min_benchmark();
	// body...
}