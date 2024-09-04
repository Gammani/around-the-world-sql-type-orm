
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/": {
        "get": {
          "operationId": "AppController_getHello",
          "summary": "Default endpoint",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Hello World!"
            }
          }
        }
      },
      "/auth/registration": {
        "post": {
          "operationId": "AuthController_registration",
          "summary": "Registration in the system. Email with confirmation code will be send to passed email address",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserCreateModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Input data is accepted. Email with confirmation code will be send to passed email address"
            },
            "400": {
              "description": "If the inputModel has incorrect values (in particular if the user with the given email or login already exists)",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/registration-confirmation": {
        "post": {
          "operationId": "AuthController_registrationConfirmation",
          "summary": "Confirm registration",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ConfirmCodeModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Email was verified. Account was activated"
            },
            "400": {
              "description": "If the confirmation code is incorrect, expired or already been applied",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/password-recovery": {
        "post": {
          "operationId": "AuthController_passwordRecovery",
          "summary": "Password recovery via Email confirmation. Email should be sent with RecoveryCode inside",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EmailPasswordRecoveryInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Even if current email is not registered (for prevent user's email detection)"
            },
            "400": {
              "description": "If the inputModel has invalid email (for example 222^gmail.com)",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/new-password": {
        "post": {
          "operationId": "AuthController_newPassword",
          "summary": "Confirm password recovery",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NewPasswordModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "If code is valid and new password is accepted"
            },
            "400": {
              "description": "If the inputModel has incorrect value (for incorrect password length) or RecoveryCode is incorrect or expired"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/login": {
        "post": {
          "operationId": "AuthController_login",
          "summary": "Try login user to the system",
          "parameters": [
            {
              "name": "user-agent",
              "required": true,
              "in": "header",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthInputModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Returns JWT accessToken (expired after 5 minutes) in body and JWT refreshToken in cookie (http-only, secure) (expired after 24 hours).",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "accessToken": "string"
                    }
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "If the password or login is wrong"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/refresh-token": {
        "post": {
          "operationId": "AuthController_refreshToken",
          "summary": "Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing)Device LastActiveDate should be overrode by issued Date of new refresh token",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Returns JWT accessToken (expired after 5 minutes) in body and JWT refreshToken in cookie (http-only, secure) (expired after 24 hours).",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "accessToken": "string"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "If the password or login is wrong"
            }
          },
          "security": [
            {
              "cookie": []
            }
          ],
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/registration-email-resending": {
        "post": {
          "operationId": "AuthController_registrationEmailResending",
          "summary": "Resend confirmation registration Email if user exist",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EmailInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Input data is accepted.Email with confirmation code will be send to passed email address.Confirmation code should be inside link as query param, for example: https://some-front.com/confirm-registration?code=youtcodehere"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/logout": {
        "post": {
          "operationId": "AuthController_logout",
          "summary": "In cookie client must send correct refreshToken that will be revoked",
          "parameters": [],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "If the password or login is wrong"
            }
          },
          "security": [
            {
              "cookie": []
            }
          ],
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/me": {
        "get": {
          "operationId": "AuthController_me",
          "summary": "Get information about current user",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserInfoDTO"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "JWT-auth": []
            }
          ],
          "tags": [
            "Auth"
          ]
        }
      },
      "/security/devices": {
        "get": {
          "operationId": "SecurityDeviceController_getAllDevicesFromUser",
          "summary": "Return all devices with active sessions for current user",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/DeviceDTO"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "cookie": []
            }
          ],
          "tags": [
            "SecurityDevices"
          ]
        },
        "delete": {
          "operationId": "SecurityDeviceController_terminateAllExcludeCurrentSession",
          "summary": "Terminate all other (exclude current) devices sessions",
          "parameters": [],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "cookie": []
            }
          ],
          "tags": [
            "SecurityDevices"
          ]
        }
      },
      "/security/devices/{deviceId}": {
        "delete": {
          "operationId": "SecurityDeviceController_terminateSessionById",
          "summary": "Terminate specified device session",
          "parameters": [
            {
              "name": "deviceId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If try to delete the deviceId of other user"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "security": [
            {
              "cookie": []
            }
          ],
          "tags": [
            "SecurityDevices"
          ]
        }
      },
      "/sa/users": {
        "get": {
          "operationId": "UsersController_getAllUsers",
          "summary": "Return all users",
          "parameters": [
            {
              "required": false,
              "description": "Search term for user Login: Login should contains this term in any position",
              "name": "searchLoginTerm",
              "in": "query",
              "schema": {
                "default": null,
                "type": "string"
              }
            },
            {
              "required": false,
              "description": "Search term for user Email: Email should contains this term in any position",
              "name": "searchEmailTerm",
              "in": "query",
              "schema": {
                "default": null,
                "type": "string"
              }
            },
            {
              "required": false,
              "name": "sortBy",
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "required": false,
              "name": "sortDirection",
              "in": "query",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "required": false,
              "description": "pageNumber is the number of portions that should be returned",
              "name": "pageNumber",
              "in": "query",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "required": false,
              "description": "pageSize is the size of portions that should be returned",
              "name": "pageSize",
              "in": "query",
              "schema": {
                "default": 10,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserWithPaginationViewModelDTO"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "admin/users"
          ]
        },
        "post": {
          "operationId": "UsersController_createUserByAdmin",
          "summary": "Add new user to the system",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserCreateModel"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created user",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserDTO"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values.",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "admin/users"
          ]
        }
      },
      "/sa/users/{id}": {
        "get": {
          "operationId": "UsersController_findUserById",
          "summary": "Return user by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserDTO"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "admin/users"
          ]
        },
        "delete": {
          "operationId": "UsersController_removeUserByAdmin",
          "summary": "Delete user specified by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "If specified user is not exists"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "admin/users"
          ]
        }
      },
      "/testing/all-data": {
        "delete": {
          "operationId": "TestingRemoveAll_removeAllData",
          "summary": "Clear database: delete all data from all tables/collections",
          "parameters": [],
          "responses": {
            "204": {
              "description": "All data is deleted"
            }
          },
          "tags": [
            "Testing"
          ]
        }
      },
      "/sa/blogs": {
        "get": {
          "operationId": "BlogsController_getAllBlogs",
          "summary": "Return all blogs with paging",
          "parameters": [
            {
              "required": false,
              "description": "Search term for blog Name: Name should contains this term in any position",
              "name": "searchNameTerm",
              "in": "query",
              "schema": {
                "default": null,
                "type": "string"
              }
            },
            {
              "required": false,
              "name": "sortBy",
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "required": false,
              "name": "sortDirection",
              "in": "query",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "required": false,
              "description": "pageNumber is the number of portions that should be returned",
              "name": "pageNumber",
              "in": "query",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "required": false,
              "description": "pageSize is the size of portions that should be returned",
              "name": "pageSize",
              "in": "query",
              "schema": {
                "default": 10,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogsWithPaginationViewModelDTO"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "admin/blogs"
          ]
        },
        "post": {
          "operationId": "BlogsController_createBlogByAdmin",
          "summary": "Create new Blog",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BlogCreateModel"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created blog",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogDTO"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "admin/blogs"
          ]
        }
      },
      "/sa/blogs/{id}": {
        "get": {
          "operationId": "BlogsController_findBlogById",
          "summary": "Return blog by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogDTO"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "admin/blogs"
          ]
        },
        "put": {
          "operationId": "BlogsController_updateBlogByAdmin",
          "summary": "Update existing Blog by id with InputModel",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BlogUpdateModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "admin/blogs"
          ]
        },
        "delete": {
          "operationId": "BlogsController_removeBlogByAdmin",
          "summary": "Delete blog specified by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "admin/blogs"
          ]
        }
      },
      "/sa/blogs/{blogId}/posts": {
        "get": {
          "operationId": "BlogsController_getPostsByBlogId",
          "summary": "Return posts for blog with paging amd sorting",
          "parameters": [
            {
              "required": true,
              "name": "blogId",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "required": false,
              "name": "sortBy",
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "required": false,
              "name": "sortDirection",
              "in": "query",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "required": false,
              "description": "pageNumber is the number of portions that should be returned",
              "name": "pageNumber",
              "in": "query",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "required": false,
              "description": "pageSize is the size of portions that should be returned",
              "name": "pageSize",
              "in": "query",
              "schema": {
                "default": 10,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewModelDTO"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "admin/blogs"
          ]
        },
        "post": {
          "operationId": "BlogsController_createPostByBlogIdByAdmin",
          "summary": "Create new Post fo specific blog",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostCreateModel"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created post",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostDTO"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "admin/blogs"
          ]
        }
      },
      "/sa/blogs/{blogId}/posts/{id}": {
        "put": {
          "operationId": "BlogsController_updatePostByAdmin",
          "summary": "Update existing post by id with InputModel",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateInputPostModelType"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "admin/blogs"
          ]
        },
        "delete": {
          "operationId": "BlogsController_removePostByAdmin",
          "summary": "Delete blog specified by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "admin/blogs"
          ]
        },
        "get": {
          "operationId": "BlogsController_findPostById",
          "summary": "Return post by id for specified blogId ",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewModelDTO"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "admin/blogs"
          ]
        }
      },
      "/comments/{id}": {
        "get": {
          "operationId": "CommentsController_getCommentById",
          "summary": "Returns comment by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CommentDTO"
                  }
                }
              }
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Comments"
          ]
        }
      },
      "/comments/{commentId}": {
        "put": {
          "operationId": "CommentsController_updateCommentById",
          "summary": "Update existing comment by id with InputModel",
          "parameters": [
            {
              "name": "commentId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CommentInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values.",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If try edit the comment that is not your own"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "security": [
            {
              "JWT-auth": []
            }
          ],
          "tags": [
            "Comments"
          ]
        },
        "delete": {
          "operationId": "CommentsController_removeCommentById",
          "summary": "Delete comment specified by id",
          "parameters": [
            {
              "name": "commentId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If try delete the comment that is not your own"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "security": [
            {
              "JWT-auth": []
            }
          ],
          "tags": [
            "Comments"
          ]
        }
      },
      "/comments/{commentId}/like-status": {
        "put": {
          "operationId": "CommentsController_updateCommentLikeStatus",
          "summary": "Make like/unlike/dislike operation",
          "parameters": [
            {
              "name": "commentId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CommentLikeModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            },
            "400": {
              "description": "If the inputModel has incorrect values.",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "If comment with specified id doesn't exists"
            }
          },
          "security": [
            {
              "JWT-auth": []
            }
          ],
          "tags": [
            "Comments"
          ]
        }
      },
      "/sa/quiz/questions": {
        "get": {
          "operationId": "QuizSController_getAllQuestions",
          "summary": "Return all questions with pagination and filtering",
          "parameters": [
            {
              "required": false,
              "name": "bodySearchTerm",
              "in": "query",
              "schema": {
                "default": null,
                "type": "string"
              }
            },
            {
              "required": false,
              "name": "publishedStatus",
              "in": "query",
              "schema": {
                "default": "all",
                "enum": [
                  "all",
                  "published",
                  "notPublished"
                ],
                "type": "string"
              }
            },
            {
              "required": false,
              "name": "sortBy",
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "required": false,
              "name": "sortDirection",
              "in": "query",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "required": false,
              "description": "pageNumber is the number of portions that should be returned",
              "name": "pageNumber",
              "in": "query",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "required": false,
              "description": "pageSize is the size of portions that should be returned",
              "name": "pageSize",
              "in": "query",
              "schema": {
                "default": 10,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/QuizQuestionsViewModelDTO"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "admin/QuizQuestions"
          ]
        },
        "post": {
          "operationId": "QuizSController_createQuestion",
          "summary": "Create question",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/QuestionInputModel"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/QuizQuestionDTO"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values.",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "admin/QuizQuestions"
          ]
        }
      },
      "/sa/quiz/questions/{id}": {
        "put": {
          "operationId": "QuizSController_updateQuestion",
          "summary": "Update question",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/QuestionInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values.",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "admin/QuizQuestions"
          ]
        },
        "delete": {
          "operationId": "QuizSController_deleteQuestion",
          "summary": "Delete question",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "admin/QuizQuestions"
          ]
        }
      },
      "/sa/quiz/questions/{id}/publish": {
        "put": {
          "operationId": "QuizSController_publishQuestion",
          "summary": "Publish/unpublish question",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PublishedInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values.",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "admin/QuizQuestions"
          ]
        }
      },
      "/pair-game-quiz/pairs/my-current": {
        "get": {
          "operationId": "QuizController_returnCurrentUnfinishedGame",
          "summary": "Returns current pair in which current user is taking part",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Returns current pair in which current user is taking part",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/QuizGameViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "If no active pair for current user"
            }
          },
          "security": [
            {
              "JWT-auth": []
            }
          ],
          "tags": [
            "QuizGame"
          ]
        }
      },
      "/pair-game-quiz/pairs/{id}": {
        "get": {
          "operationId": "QuizController_findGameById",
          "summary": "Returns game by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Returns pair by id",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/QuizGameViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values.",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If current user tries to get pair in which user is not participant"
            },
            "404": {
              "description": "If no active pair for current user"
            }
          },
          "security": [
            {
              "JWT-auth": []
            }
          ],
          "tags": [
            "QuizGame"
          ]
        }
      },
      "/pair-game-quiz/pairs/connection": {
        "post": {
          "operationId": "QuizController_Connection",
          "summary": "Connect current user to existing random pending pair or create new pair which will be waiting second player",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Returns started existing pair or new pair with status \"PendingSecondPlayer\"",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/QuizGameViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If current user tries to get pair in which user is not participant"
            }
          },
          "security": [
            {
              "JWT-auth": []
            }
          ],
          "tags": [
            "QuizGame"
          ]
        }
      },
      "/pair-game-quiz/pairs/my-current/answers": {
        "post": {
          "operationId": "QuizController_sendAnswerFromUser",
          "summary": "Send answer for next not answered question in active pair",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "string"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Returns answer result",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/AnswerDTO"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If current user tries to get pair in which user is not participant"
            }
          },
          "security": [
            {
              "JWT-auth": []
            }
          ],
          "tags": [
            "QuizGame"
          ]
        }
      },
      "/blogs": {
        "get": {
          "operationId": "BlogsController_getAllBlogs",
          "summary": "Return all blogs with paging",
          "parameters": [
            {
              "required": false,
              "description": "Search term for blog Name: Name should contains this term in any position",
              "name": "searchNameTerm",
              "in": "query",
              "schema": {
                "default": null,
                "type": "string"
              }
            },
            {
              "required": false,
              "name": "sortBy",
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "required": false,
              "name": "sortDirection",
              "in": "query",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "required": false,
              "description": "pageNumber is the number of portions that should be returned",
              "name": "pageNumber",
              "in": "query",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "required": false,
              "description": "pageSize is the size of portions that should be returned",
              "name": "pageSize",
              "in": "query",
              "schema": {
                "default": 10,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogsWithPaginationViewModelDTO"
                  }
                }
              }
            }
          },
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogs/{blogId}/posts": {
        "get": {
          "operationId": "BlogsController_getPostsByBlogId",
          "summary": "Return posts for blog with paging amd sorting",
          "parameters": [
            {
              "required": true,
              "name": "blogId",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "required": false,
              "name": "sortBy",
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "required": false,
              "name": "sortDirection",
              "in": "query",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "required": false,
              "description": "pageNumber is the number of portions that should be returned",
              "name": "pageNumber",
              "in": "query",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "required": false,
              "description": "pageSize is the size of portions that should be returned",
              "name": "pageSize",
              "in": "query",
              "schema": {
                "default": 10,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewModelDTO"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogs/{id}": {
        "get": {
          "operationId": "BlogsController_findBlogById",
          "summary": "Return blog by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogDTO"
                  }
                }
              }
            }
          },
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogs/{blogId}/posts/{id}": {
        "get": {
          "operationId": "BlogsController_findPostById",
          "summary": "Return post by id for specified blogId ",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewModelDTO"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Blogs"
          ]
        }
      },
      "/posts/{postId}/like-status": {
        "put": {
          "operationId": "PostsController_updatePostLikeStatus",
          "summary": "Make like/unlike/dislike operation",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostLikeModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            },
            "400": {
              "description": "If the inputModel has incorrect values.",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "If post with specified postId doesn't exists"
            }
          },
          "security": [
            {
              "JWT-auth": []
            }
          ],
          "tags": [
            "Posts"
          ]
        }
      },
      "/posts/{postId}/comments": {
        "get": {
          "operationId": "PostsController_getCommentsByPostId",
          "summary": "Returns comments for specified post",
          "parameters": [
            {
              "required": true,
              "name": "postId",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "required": false,
              "name": "sortBy",
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "required": false,
              "name": "sortDirection",
              "in": "query",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "required": false,
              "description": "pageNumber is the number of portions that should be returned",
              "name": "pageNumber",
              "in": "query",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "required": false,
              "description": "pageSize is the size of portions that should be returned",
              "name": "pageSize",
              "in": "query",
              "schema": {
                "default": 10,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CommentsWithPaginationViewModelDTO"
                  }
                }
              }
            },
            "404": {
              "description": "If post for passed postId doesn't exist"
            }
          },
          "tags": [
            "Posts"
          ]
        },
        "post": {
          "operationId": "PostsController_createCommentByPostId",
          "summary": "Create new comment",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CommentInputModel"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created comment",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CommentDTO"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values.",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "If post with specified postId doesn't exists"
            }
          },
          "security": [
            {
              "JWT-auth": []
            }
          ],
          "tags": [
            "Posts"
          ]
        }
      },
      "/posts": {
        "get": {
          "operationId": "PostsController_getAllPosts",
          "summary": "Returns all posts",
          "parameters": [
            {
              "required": false,
              "name": "sortBy",
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "required": false,
              "name": "sortDirection",
              "in": "query",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "required": false,
              "description": "pageNumber is the number of portions that should be returned",
              "name": "pageNumber",
              "in": "query",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "required": false,
              "description": "pageSize is the size of portions that should be returned",
              "name": "pageSize",
              "in": "query",
              "schema": {
                "default": 10,
                "type": "number"
              }
            },
            {
              "required": true,
              "name": "postId",
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostsWithPaginationViewModelDTO"
                  }
                }
              }
            }
          },
          "tags": [
            "Posts"
          ]
        }
      },
      "/posts/{id}": {
        "get": {
          "operationId": "PostsController_findPostById",
          "summary": "Returns post by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostDTO"
                  }
                }
              }
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Posts"
          ]
        }
      }
    },
    "info": {
      "title": "API Around The World",
      "description": "The API description",
      "version": "1.0",
      "contact": {}
    },
    "tags": [
      {
        "name": "example",
        "description": ""
      }
    ],
    "servers": [],
    "components": {
      "securitySchemes": {
        "JWT-auth": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http",
          "name": "JWT",
          "description": "Enter JWT Bearer token only",
          "in": "header"
        },
        "cookie": {
          "type": "apiKey",
          "in": "cookie",
          "name": "refreshToken",
          "description": "JWT refreshToken inside cookie. Must be correct, and must not expire"
        },
        "basic": {
          "type": "http",
          "scheme": "basic",
          "description": "basic"
        }
      },
      "schemas": {
        "UserCreateModel": {
          "type": "object",
          "properties": {
            "login": {
              "type": "string",
              "description": "Unique login for the user",
              "example": "HZTfbj1p0A"
            },
            "password": {
              "type": "string",
              "description": "password",
              "example": "string"
            },
            "email": {
              "type": "string",
              "description": "email",
              "example": "example@example.com"
            }
          },
          "required": [
            "login",
            "password",
            "email"
          ]
        },
        "ConfirmCodeModel": {
          "type": "object",
          "properties": {
            "code": {
              "type": "string",
              "description": "code",
              "example": "string"
            }
          },
          "required": [
            "code"
          ]
        },
        "EmailPasswordRecoveryInputModel": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "description": "email",
              "example": "string"
            }
          },
          "required": [
            "email"
          ]
        },
        "NewPasswordModel": {
          "type": "object",
          "properties": {
            "newPassword": {
              "type": "string",
              "description": "password",
              "example": "string"
            },
            "passwordRecoveryCode": {
              "type": "string",
              "description": "code",
              "example": "string"
            }
          },
          "required": [
            "newPassword",
            "passwordRecoveryCode"
          ]
        },
        "AuthInputModel": {
          "type": "object",
          "properties": {
            "loginOrEmail": {
              "type": "string",
              "description": "loginOrEmail",
              "example": "string"
            },
            "password": {
              "type": "string",
              "description": "password",
              "example": "string"
            }
          },
          "required": [
            "loginOrEmail",
            "password"
          ]
        },
        "EmailInputModel": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "description": "email",
              "example": "string"
            }
          },
          "required": [
            "email"
          ]
        },
        "UserInfoDTO": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "example": "user@example.com"
            },
            "login": {
              "type": "string",
              "example": "username123"
            },
            "userId": {
              "type": "string",
              "example": "12345"
            }
          },
          "required": [
            "email",
            "login",
            "userId"
          ]
        },
        "DeviceDTO": {
          "type": "object",
          "properties": {
            "ip": {
              "type": "string",
              "example": "string"
            },
            "title": {
              "type": "string",
              "example": "string"
            },
            "lastActiveDate": {
              "type": "string",
              "example": "string"
            },
            "deviceId": {
              "type": "string",
              "example": "string"
            }
          },
          "required": [
            "ip",
            "title",
            "lastActiveDate",
            "deviceId"
          ]
        },
        "UserDTO": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "string"
            },
            "login": {
              "type": "string",
              "example": "string"
            },
            "email": {
              "type": "string",
              "example": "string"
            },
            "createdAt": {
              "type": "string",
              "example": "2024-08-28T13:52:58.823Z"
            }
          },
          "required": [
            "id",
            "login",
            "email",
            "createdAt"
          ]
        },
        "UserWithPaginationViewModelDTO": {
          "type": "object",
          "properties": {
            "pageCount": {
              "type": "number",
              "example": 0
            },
            "page": {
              "type": "number",
              "example": 0
            },
            "pageSize": {
              "type": "number",
              "example": 0
            },
            "totalCount": {
              "type": "number",
              "example": 0
            },
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/UserDTO"
              }
            }
          },
          "required": [
            "pageCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        },
        "BlogDTO": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "string"
            },
            "name": {
              "type": "string",
              "example": "string"
            },
            "description": {
              "type": "string",
              "example": "string"
            },
            "websiteUrl": {
              "type": "string",
              "example": "string"
            },
            "createdAt": {
              "type": "string",
              "example": "2024-08-28T13:52:58.823Z"
            },
            "isMembership": {
              "type": "boolean",
              "example": true
            }
          },
          "required": [
            "id",
            "name",
            "description",
            "websiteUrl",
            "createdAt",
            "isMembership"
          ]
        },
        "BlogsWithPaginationViewModelDTO": {
          "type": "object",
          "properties": {
            "pageCount": {
              "type": "number",
              "example": 0
            },
            "page": {
              "type": "number",
              "example": 0
            },
            "pageSize": {
              "type": "number",
              "example": 0
            },
            "totalCount": {
              "type": "number",
              "example": 0
            },
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/BlogDTO"
              }
            }
          },
          "required": [
            "pageCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        },
        "NewestLikesDTO": {
          "type": "object",
          "properties": {
            "addedAt": {
              "type": "string",
              "example": "2024-08-29T04:44:57.801Z"
            },
            "userId": {
              "type": "string",
              "example": "string"
            },
            "login": {
              "type": "string",
              "example": "string"
            }
          },
          "required": [
            "addedAt",
            "userId",
            "login"
          ]
        },
        "ExtendedLikesInfoDTO": {
          "type": "object",
          "properties": {
            "likesCount": {
              "type": "number",
              "example": 0
            },
            "dislikesCount": {
              "type": "number",
              "example": 0
            },
            "myStatus": {
              "type": "object",
              "example": "None"
            },
            "newestLikes": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/NewestLikesDTO"
              }
            }
          },
          "required": [
            "likesCount",
            "dislikesCount",
            "myStatus",
            "newestLikes"
          ]
        },
        "PostViewModelDTO": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "string"
            },
            "title": {
              "type": "string",
              "example": "string"
            },
            "shortDescription": {
              "type": "string",
              "example": "string"
            },
            "content": {
              "type": "string",
              "example": "string"
            },
            "blogId": {
              "type": "string",
              "example": "2024-08-28T13:52:58.823Z"
            },
            "blogName": {
              "type": "string",
              "example": true
            },
            "createdAt": {
              "type": "string",
              "example": true
            },
            "extendedLikesInfo": {
              "example": class ExtendedLikesInfoDTO {
},
              "allOf": [
                {
                  "$ref": "#/components/schemas/ExtendedLikesInfoDTO"
                }
              ]
            }
          },
          "required": [
            "id",
            "title",
            "shortDescription",
            "content",
            "blogId",
            "blogName",
            "createdAt",
            "extendedLikesInfo"
          ]
        },
        "BlogCreateModel": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "name",
              "example": "string"
            },
            "description": {
              "type": "string",
              "description": "description",
              "example": "string"
            },
            "websiteUrl": {
              "type": "string",
              "description": "websiteUrl",
              "example": "https://tjyiiObWFcs6oLposi_9a-B8mhhzaFy9q3zuP2mFR4Yrz78Rvun5vS.RIC"
            }
          },
          "required": [
            "name",
            "description",
            "websiteUrl"
          ]
        },
        "PostCreateModel": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "description": "title",
              "example": "string"
            },
            "shortDescription": {
              "type": "string",
              "description": "shortDescription",
              "example": "string"
            },
            "content": {
              "type": "string",
              "description": "content",
              "example": "string"
            }
          },
          "required": [
            "title",
            "shortDescription",
            "content"
          ]
        },
        "PostDTO": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "string"
            },
            "title": {
              "type": "string",
              "example": "string"
            },
            "shortDescription": {
              "type": "string",
              "example": "string"
            },
            "content": {
              "type": "string",
              "example": "string"
            },
            "blogId": {
              "type": "string",
              "example": "string"
            },
            "blogName": {
              "type": "string",
              "example": "string"
            },
            "createdAt": {
              "type": "string",
              "example": "2024-08-28T13:52:58.823Z"
            },
            "extendedLikesInfo": {
              "example": class ExtendedLikesInfoDTO {
},
              "allOf": [
                {
                  "$ref": "#/components/schemas/ExtendedLikesInfoDTO"
                }
              ]
            }
          },
          "required": [
            "id",
            "title",
            "shortDescription",
            "content",
            "blogId",
            "blogName",
            "createdAt",
            "extendedLikesInfo"
          ]
        },
        "BlogUpdateModel": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "name",
              "example": "string"
            },
            "description": {
              "type": "string",
              "description": "description",
              "example": "string"
            },
            "websiteUrl": {
              "type": "string",
              "description": "websiteUrl",
              "example": "https://tjyiiObWFcs6oLposi_9a-B8mhhzaFy9q3zuP2mFR4Yrz78Rvun5vS.RIC"
            }
          },
          "required": [
            "name",
            "description",
            "websiteUrl"
          ]
        },
        "UpdateInputPostModelType": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "description": "title",
              "example": "string"
            },
            "shortDescription": {
              "type": "string",
              "description": "shortDescription",
              "example": "string"
            },
            "content": {
              "type": "string",
              "description": "content",
              "example": "string"
            }
          },
          "required": [
            "title",
            "shortDescription",
            "content"
          ]
        },
        "CommentatorInfoDTO": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string",
              "example": "string"
            },
            "userLogin": {
              "type": "string",
              "example": "string"
            }
          },
          "required": [
            "userId",
            "userLogin"
          ]
        },
        "CommentLikeDTO": {
          "type": "object",
          "properties": {
            "likesCount": {
              "type": "number",
              "example": 0
            },
            "dislikesCount": {
              "type": "number",
              "example": 0
            },
            "myStatus": {
              "type": "string",
              "example": "None"
            }
          },
          "required": [
            "likesCount",
            "dislikesCount",
            "myStatus"
          ]
        },
        "CommentDTO": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "string"
            },
            "content": {
              "type": "string",
              "example": "string"
            },
            "commentatorInfo": {
              "$ref": "#/components/schemas/CommentatorInfoDTO"
            },
            "createdAt": {
              "type": "string",
              "example": "2024-09-02T14:52:07.296Z"
            },
            "likesInfo": {
              "$ref": "#/components/schemas/CommentLikeDTO"
            }
          },
          "required": [
            "id",
            "content",
            "commentatorInfo",
            "createdAt",
            "likesInfo"
          ]
        },
        "CommentInputModel": {
          "type": "object",
          "properties": {
            "content": {
              "type": "string",
              "description": "content",
              "example": "stringstringstringst"
            }
          },
          "required": [
            "content"
          ]
        },
        "CommentLikeModel": {
          "type": "object",
          "properties": {
            "likeStatus": {
              "type": "object",
              "description": "like-status",
              "example": "None"
            }
          },
          "required": [
            "likeStatus"
          ]
        },
        "QuizQuestionDTO": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "string"
            },
            "body": {
              "type": "string",
              "example": "string"
            },
            "correctAnswers": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "published": {
              "type": "boolean",
              "example": false
            },
            "createdAt": {
              "type": "string",
              "example": "2024-09-01T13:33:52.259Z"
            },
            "updatedAt": {
              "type": "string",
              "example": "2024-09-01T13:33:52.259Z"
            }
          },
          "required": [
            "id",
            "body",
            "correctAnswers",
            "published",
            "createdAt",
            "updatedAt"
          ]
        },
        "QuizQuestionsViewModelDTO": {
          "type": "object",
          "properties": {
            "pageCount": {
              "type": "number",
              "example": 0
            },
            "page": {
              "type": "number",
              "example": 0
            },
            "pageSize": {
              "type": "number",
              "example": 0
            },
            "totalCount": {
              "type": "number",
              "example": 0
            },
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/QuizQuestionDTO"
              }
            }
          },
          "required": [
            "pageCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        },
        "QuestionInputModel": {
          "type": "object",
          "properties": {
            "body": {
              "type": "string",
              "description": "body",
              "example": "stringstri"
            },
            "correctAnswers": {
              "description": "array correct answers",
              "example": [
                "string"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "body",
            "correctAnswers"
          ]
        },
        "PublishedInputModel": {
          "type": "object",
          "properties": {
            "published": {
              "type": "boolean",
              "description": "body",
              "example": true
            }
          },
          "required": [
            "published"
          ]
        },
        "Answer": {
          "type": "object",
          "properties": {
            "questionId": {
              "type": "string",
              "example": "string"
            },
            "answerStatus": {
              "type": "string",
              "example": "Correct"
            },
            "addedAt": {
              "type": "string",
              "example": "2024-09-02T11:55:33.576Z"
            }
          },
          "required": [
            "questionId",
            "answerStatus",
            "addedAt"
          ]
        },
        "QuizPlayer": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "string"
            },
            "login": {
              "type": "string",
              "example": "string"
            }
          },
          "required": [
            "id",
            "login"
          ]
        },
        "PlayerProgressInGame": {
          "type": "object",
          "properties": {
            "answers": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Answer"
              }
            },
            "player": {
              "$ref": "#/components/schemas/QuizPlayer"
            },
            "score": {
              "type": "number",
              "example": 0
            }
          },
          "required": [
            "answers",
            "player",
            "score"
          ]
        },
        "QuizGameViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "string"
            },
            "firstPlayerProgress": {
              "$ref": "#/components/schemas/PlayerProgressInGame"
            },
            "secondPlayerProgress": {
              "$ref": "#/components/schemas/PlayerProgressInGame"
            },
            "status": {
              "type": "string",
              "example": "PendingSecondPlayer"
            },
            "pairCreatedDate": {
              "type": "string",
              "example": "2024-09-02T13:01:42.937Z"
            },
            "startGameDate": {
              "type": "string",
              "example": "2024-09-02T13:01:42.937Z"
            },
            "finishGameDate": {
              "type": "string",
              "example": "2024-09-02T13:01:42.937Z"
            }
          },
          "required": [
            "id",
            "firstPlayerProgress",
            "secondPlayerProgress",
            "status",
            "pairCreatedDate",
            "startGameDate",
            "finishGameDate"
          ]
        },
        "AnswerDTO": {
          "type": "object",
          "properties": {
            "questionId": {
              "type": "string",
              "example": "string"
            },
            "answerStatus": {
              "type": "string",
              "example": "Correct"
            },
            "addedAt": {
              "type": "string",
              "example": "2024-09-02T13:16:56.403Z"
            }
          },
          "required": [
            "questionId",
            "answerStatus",
            "addedAt"
          ]
        },
        "PostLikeModel": {
          "type": "object",
          "properties": {
            "likeStatus": {
              "type": "object",
              "description": "like-status",
              "example": "None"
            }
          },
          "required": [
            "likeStatus"
          ]
        },
        "CommentsWithPaginationViewModelDTO": {
          "type": "object",
          "properties": {
            "pageCount": {
              "type": "number",
              "example": 0
            },
            "page": {
              "type": "number",
              "example": 0
            },
            "pageSize": {
              "type": "number",
              "example": 0
            },
            "totalCount": {
              "type": "number",
              "example": 0
            },
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/CommentDTO"
              }
            }
          },
          "required": [
            "pageCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        },
        "PostsWithPaginationViewModelDTO": {
          "type": "object",
          "properties": {
            "pageCount": {
              "type": "number",
              "example": 0
            },
            "page": {
              "type": "number",
              "example": 0
            },
            "pageSize": {
              "type": "number",
              "example": 0
            },
            "totalCount": {
              "type": "number",
              "example": 0
            },
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PostViewModelDTO"
              }
            }
          },
          "required": [
            "pageCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
