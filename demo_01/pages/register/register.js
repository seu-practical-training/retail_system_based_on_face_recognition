//const config = require('../../config/config.default.js')

Page({
  data:{
    send : false,
    alreadySend: false,
    second: 60,
    disabled: true,
    buttonType: 'default',
    phoneNum:'',
    code:''

  },
    
    inputPhoneNum: function(e){
      let phoneNum = e.detail.value
      if(phoneNum.length === 11){
        let checkedNum = this.checkPhoneNum(phoneNum)
        if(checkedNum){
          this.setData({
            phoneNum : phoneNum
          })
          console.log('phoneNum' + this.data.phoneNum)
          this.showSendMsg()
          this.activeButton()
        }
      }else{
        this.setData({
          phoneNum:''
        })
        this.hideSendMsg()
      }
    },

    checkPhoneNum: function(phoneNum){
      let str = /^1\d{10}$/
      if (str.test(phoneNum)){
        return true
      } else{
        wx.showToast({
          title: '手机号码不正确'
        })
        return false
      }
    },

    showSendMsg: function () {
      if (!this.data.alreadySend){
        this.setData({
          send : true
        })
      }
    },

    hideSendMsg: function () {
      this.setData({
        send: false,
        disabled: true,
        buttonType: 'default'
      })
    },

    sendMsg: function () {
      wx.request({
        url: `${config.api + '/msg'}`,
        data: {
          phoneNum: this.data.phoneNum
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'Post',
        success: function (res) {
          console.log(res)
        }
      })
      this.setData({
        alreadySend: true,
        send: false
      })
      this.timer()
    },

    timer: function () {
      let promise = new Promise((resolve, reject) =>{
        let setTimer = setInterval(
          () => {
            this.setData({
              second: this.data.second - 1
            })
            if (this.data.second <= 0){
              this.setData({
                second: 60,
                alreadySend: false,
                send: true
              })
              resolve(setTimer)
            }
          }
        , 1000)
    })
    promise.them((setTimer) =>{
      clearInterval(setTimer)
    })
  },

    addCode: function (e) {
      this.setData({
        code: e.detail.value
      })
      this.activeButton()
      console.log('code' + this.data.code)
    },

    activeButton: function () {
      let {phoneNum, code, otherInfo} = this.data
      console.log(code)
      if (phoneNum && code ){
        this.setData({
          disabled: false,
          buttonType: 'default'
        })
      }
    },

    navigate(){
      wx.navigateTo({
        url:'/pages/code/code'
        })
    },

    onSubmit: function () {
      wx.request({
        url: `${config.api + '/addinfo'}`,
        data: {
          phoneNum: this.data.phoneNum,
          code: this.data.code
        },
        header:{
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          console.log(res)

          if((parseInt(res.statusCode) === 200) && res.data.message ==='pass'){
            wx.showToast({
              title:'验证成功',
              icon: 'sucess'
            })
          } else {
            wx.showToast({
              title: res.data.message
            })
          }
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
})