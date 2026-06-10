/** 大众/小众路线分类（id >= 13 为小众野路） */
const NICHE_START_ID = 13;

const AUDIENCE_LABELS = {
  popular: '大众',
  niche: '小众'
};

function resolveAudience(route) {
  if (route.audience === 'popular' || route.audience === 'niche') {
    return route.audience;
  }
  return Number(route.id) >= NICHE_START_ID ? 'niche' : 'popular';
}

function enrichAudience(route) {
  const audience = resolveAudience(route);
  return {
    audience,
    audienceLabel: AUDIENCE_LABELS[audience]
  };
}

module.exports = {
  NICHE_START_ID,
  AUDIENCE_LABELS,
  resolveAudience,
  enrichAudience
};
