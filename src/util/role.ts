export const checkRole = (role: string) => {
  return (req, res, next) => {
    if (req.user.role === role) {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
  };
}