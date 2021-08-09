module.exports = async (ctx, next) => {
  let route = ctx.request.route;

  // Use these to log data coming from the user
  // Koa Docs: https://koajs.com/#request
  // console.log(ctx.request.route);
  // console.log(ctx.query)
  // console.log(ctx.params)
  // console.log(ctx.request.body)
  // console.log(ctx.state.user)

  if (ctx.state.user) {
    // FIND & COUNT
    if (route.action === "find" || route.action === "count") {
      if (Object.keys(ctx.query).length === 0) {
        ctx.query = {
          user: ctx.state.user.id,
        };
      } else {
        ctx.query.user = ctx.state.user.id;
      }
      await next();

      // FINDONE
    } else if (route.action === "findone") {
      let data = await strapi
        .query(route.controller)
        .findOne({ id: ctx.params.id }, []);

      if (data) {
        if (data.user !== ctx.state.user.id) {
          return ctx.unauthorized("You are not the owner of this note");
        } else {
          return await next();
        }
      }

      // CREATE
    } else if (route.action === "create") {
      ctx.request.body.user = ctx.state.user.id;
      return await next();

      //UPDATE
    } else if (route.action === "update") {
      let data = await strapi
        .query(route.controller)
        .findOne({ id: ctx.params.id }, []);

      if (data) {
        if (data.user !== ctx.state.user.id) {
          return ctx.unauthorized("You are not the owner of this note");
        } else {
          return await next();
        }
      }

      //DELETE
    } else if (route.action === "delete") {
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
  }
  return await next();
};
