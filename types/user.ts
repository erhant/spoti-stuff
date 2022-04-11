type UserType = {
  isAuthenticated: boolean;
  authInfo?: {
    accessToken: string;
    expiresIn: number;
    tokenType: string;
  };
  user?: {
    username: string;
    displayname: string;
    avatarURL: string;
  };
};

export default UserType;
