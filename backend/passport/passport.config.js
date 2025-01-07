import passport, { serializeUser } from "passport";
import bcrypt from "bcryptjs";

import user from "../model/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport";
import User from "../model/user.model.js";

export const configurePassword = async () => {
  passport.serializeUser((user, done) => {
    console.log("serializeUser");
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("deserializing");
    try {
      const user = await User.findBy(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error("Invalid username or password");
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          throw new Error("Invalid username or password");
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
};
