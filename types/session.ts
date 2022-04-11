import type { User } from "./spotify";
import AuthInfoType from "./authInfo";

type SessionType = {
  isAuthenticated: boolean;
  authInfo?: AuthInfoType;
  user?: User;
};

export default SessionType;
