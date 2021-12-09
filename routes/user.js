const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Article = require("../models/articles");
const Question = require("../models/questions");
const checkUser = require("../middlewares/checkUserMiddleware");
const prepareSomeTags = require('../functions/prepareSomeTags');

router.delete('/comments/delete/:questionId/:commentId', async (req, res) => {
	try {
		const { questionId, commentId } = req.params;
		const question = await Question.findByIdAndUpdate(questionId, {
			$pull: { comments: { _id: commentId } }
		}, {
			new: true
		});
		console.log(question);
		res.status(200).redirect(`/questions/${questionId}`);
	} catch (err) {
		console.log(err);
		res.status(400).render('error');
	}
});

router.patch('/comments/edit/:questionId/:commentId', (req, res) => {
	try {
		const { questionId, commentId } = req.params;
		// const question = await Question.findByIdAndUpdate(questionId, {
		// 	$pull: { comments: { _id: commentId } }
		// }, {
		// 	new: true
		// });
		// console.log(question);
		res.status(200).redirect(`/questions/${questionId}`);
	} catch (err) {
		console.log(err);
		res.status(400).render('error');
	}
});

router.get('/applying', async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(res.locals.user._id, {
			hasAppliedToBeEditor: true
		}, {
			new: true
		});
		console.log(user);
		res.redirect('/');
	} catch (err) {
		res.status(400).render("error");
	}
});

router.delete('/questions/delete/:id', async (req, res) => {
	try{
		const { id } = req.params;
		await Question.findByIdAndDelete(id);
		res.status(200).redirect('/user/questions');
	}catch(err){
		console.log(err);
		res.status(400).render('error');
	}
});

router.patch('/questions/edit/:id', async (req, res) => {
	try{
		const { id } = req.params;
		const { title, description, tags } = req.body;
		console.log(id, req.body)
		const question = await Question.findByIdAndUpdate(id, {
			title: title,
			description: description.trim(),
			tags: prepareSomeTags(tags)
		}, {
			new: true
		});
		console.log(question);
		res.status(200).redirect('/user/questions');
	}catch(err){
		console.log(err);
		res.status(400).render('error');
	}
});

router.get('/questions/edit/:id', async (req, res) => {
	const { id } = req.params;
	const question = await Question.findById(id);
	res.render('user/editQuestion', { question });
});

router.get('/questions', async (req, res) => {
	const user = await User.findById(res.locals.user._id).populate('questions');
	const questions = user.questions;
	res.render('user/questions', { questions });
});

router.delete("/savedarticles", checkUser, async (req, res) => {
	try {
		const { articleId } = req.body;
		const data = await User.findByIdAndUpdate(
			res.locals.user._id,
			{
				$pull: { saved: articleId },
			},
			{ new: true }
		);
		res.status(301).json({ url: "/user/savedarticles" });
	} catch (err) {
		res.status(400).end();
	}
});

router.get("/savedarticles", checkUser, async (req, res) => {
	let { page, skip, limit } = req.query;
	limit = parseInt(limit);
	page = parseInt(page);
	skip = parseInt(skip);
	if (!page || page < 0) {
		page = 1;
	}
	if (!skip || skip < 0) {
		skip = 4;
	}
	if (!limit || limit < 0) {
		limit = 4;
	}
	const currentPage = parseInt(page);
	let temp = currentPage;
	if (temp != 1) {
		temp--;
	}
	try {
		const count = res.locals.user.saved.length;
		const totalPages = Math.ceil(count / limit);
		if (page > totalPages) {
			temp = totalPages - 1;
			page = totalPages;
		}

		const user = await User.findById(res.locals.user._id).populate('saved');
		let savedArticles = user.saved;
		console.log(savedArticles)
		const skipAndLimit = (page, skip) => {
			//for skipping
			savedArticles = savedArticles.slice(
				(page - 1) * skip,
				(page - 1) * skip + 4
			);
			//for limiting
			savedArticles = savedArticles.slice(0, 4);
		};

		skipAndLimit(page, skip);

		res.status(200).render("user/savedArticles", {
			savedArticles,
			totalPages,
			currentPage,
			temp,
		});
	} catch (err) {
		console.log(err);
		res.status(404).render("error");
	}
});

router.post("/save", checkUser, async (req, res) => {
	try {
		const { articleId } = req.body;
		console.log(articleId);
		if (res.locals.user) {
			const data = await User.findByIdAndUpdate(
				res.locals.user._id,
				{
					$addToSet: { saved: articleId },
				},
				{
					new: true,
					upsert: true,
				}
			);
			console.log(data);
		}
		res.status(200).end();
	} catch (err) {
		console.log(err);
		res.status(400).end();
	}
});

router.post("/update", checkUser, async (req, res) => {
	try {
		if (res.locals.user.id) {
			const { name, username, email, img, bio } = req.body;
			const user = await User.findByIdAndUpdate(
				res.locals.user.id,
				{ name, username, email, img, bio },
				{ new: true }
			);
			console.log(user);
			res.status(200).json({ user: user._id });
		} else {
			res.status(200).redirect("/auth/login");
		}
	} catch (err) {
		console.log(err);
	}
});

router.get("/update", checkUser, async (req, res) => {
	res.render("user/updateProfile.ejs");
});

router.get("/profile", checkUser, async (req, res) => {
	try {
		const data = await User.findById(res.locals.user.id);
		res.status(200).render("user/profile", { data });
	} catch (err) {
		res.status(404).render("error");
	}
});

module.exports = router;
