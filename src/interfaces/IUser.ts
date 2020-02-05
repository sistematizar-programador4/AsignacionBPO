export interface IUser {
  _id: string
  name: string
  password: string
  salt: string
}

export interface IUserInputDTO {
  name: string
  password: string
}
