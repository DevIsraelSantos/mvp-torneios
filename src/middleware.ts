import { withAuthMiddleware } from "./middlewares/authMiddleware";
import { chain } from "./middlewares/chain";

export default chain([withAuthMiddleware]);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
