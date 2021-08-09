module.exports = async (ctx, next) => {
  // console.log(ctx);
  let route = ctx.request.route;
  // console.log(ctx.state.user);
  // console.log(ctx.query);
  // console.log(ctx.params);

  if (route.action === "update") {
    if (ctx.state.user) {
      let entry = await strapi
        .query(ctx.request.route.controller)
        .findOne({ id: ctx.params.id });
      if (entry.author && entry.author.id === ctx.state.user.id) {
        await next();
      } else {
        return ctx.unauthorized("You are not the author of this blogpost");
      }
    }
  } else if (route.action === "create") {
    ctx.request.body.author = ctx.state.user.id;
    await next();
  } else if (route.acount === "delete") {
    let data = await strapi
      .query(route.controller)
      .findOne({ id: ctx.params.id }, []);

    if (data) {
      if (data.user === ctx.state.user.id) {
        return await next();
      } else {
        return ctx.unauthorized("You are not the owner of this note");
      }
    }
  }

  // console.log(ctx);
};
