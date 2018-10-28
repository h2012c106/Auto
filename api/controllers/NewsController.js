/**
 * NewsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    newsQuery: async function (req, res) {
        let newsQry = await News.find({
            where: { hasReview: true },
            skip: Number(req.body.skip),
            limit: Number(req.body.limit),
            sort: 'time DESC',
            select: ['newsId', 'title', 'time', 'quotation', 'hasPic']
        });

        let newsArr = [];
        newsQry.forEach(function (n) {
            newsArr.push({
                newsUrl: n.newsId,
                picUrl: `/images/newsPic/${n.newsId}.jpg`,
                title: n.title,
                time: n.time.toLocaleString(),
                quotation: n.quotation,
                hasPic: n.hasPic,
            });
        });

        return res.json({
            newsArr
        });
    }
};

