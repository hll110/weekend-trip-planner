const { cultureArticles } = require('../../data/extensions.js');

Page({
  data: {
    articles: cultureArticles,
    activeId: cultureArticles[0] && cultureArticles[0].id
  },

  selectArticle(e) {
    this.setData({ activeId: e.currentTarget.dataset.id });
  },

  get activeArticle() {
    return this.data.articles.find(a => a.id === this.data.activeId);
  }
});
