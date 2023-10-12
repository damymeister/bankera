import jwtDecode from "jwt-decode"
interface Data {
    _id: string,
    exp: number,
    iat: number
}
export default function parseJwt (token: string) {
    return jwtDecode<Data>(token)
}