class UserService {
  private static instance: UserService;
  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  register() {
    return 'Registered!';
  }

  login() {
    return 'Loged In!';
  }
}

export default UserService;
