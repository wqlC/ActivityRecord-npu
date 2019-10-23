# 活动采集小程序
--逻辑: 用户使用微信扫码进入小程序主页，通过用户openId判断用户是否已经注册

	--已注册：直接记录活动,将活动插入到用户学号对应的数据库（collection）中  
	--未注册：跳转到注册页面，输入用户名，学号，将用户信息存储在user数据库（collection）中~~，并建立学号对应的数据库（collection）中~~。页面跳转到活动记录页面，记录活动  
 	 --活动记录：用户点击相应按钮，触发云函数addActivity，向user数据库（collection）中对应学号的字段的data字段添加数据，同时自增score

--数据: 

	--注册过程采集的数据有：姓名、学号  
	--活动采集过程记录的数据有：活动id，活动名activity，对应的时间戳timestamp, 存储到user数据库（collection）中的data字段  
	--user数据库（collection）中还记录了该用户的当前得分

--运行配置：

	--在云开发中建立user数据库（collection）用户储存用户信息（注意手动更改数据库访问权限--改为：任何人可读写）
	--将对应云函数上传到云开发中


## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)


### author: wuqilong
### last change: 20191023
