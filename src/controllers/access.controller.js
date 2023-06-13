const { CREATED, SussessResponse } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    // version 1
    // new SussessResponse({
    //   message: "OK!",
    //   metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
    // }).send(res)

    //version 2 fixed no need accesstoken
    new SussessResponse({
      message: "OK!",
      metadata: await AccessService.handlerRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res)
  }

  logout = async (req, res, next) => {
    new SussessResponse({
      message: "Logout successfully",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res)
  }

  login = async (req, res, next) => {
    new SussessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res)
  }

  signUp = async (req, res, next) => {
    new CREATED({
      message: "Regiserted Ok!",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res)
  }
}

module.exports = new AccessController()
