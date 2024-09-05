package gopractice

// start gin server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func StartGinServer() {
	gin.Bind(&gin.H{})
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})
	r.Run(":8080")
}
