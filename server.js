var express = require('express'),
    app = express(),
    http = require('http'),
    bodyParser = require('body-parser')

app.use(express.static('site'))
app.use( bodyParser.json() )
app.use(bodyParser.urlencoded({extended: true})); 

var count=0
var is_updated=false
var blocked=false
var data=[]

app.post('/redraw', function(req, res)
{
	is_updated=true
	//console.log(req.body)
	data.push(req.body)
	res.send('')
})

app.get('/get_news', function(req, res)
{
	var f=function()
	{
		count++
		console.log('1:'+count)
		var id=setInterval(function()
		{
			if(is_updated)
			{
				function clone(arr)
				{
					var ret=[]

					for(var i in arr)
					{
						var t=arr[i]
						var alloc={}

						alloc.text=t.text

						ret.push(alloc)
					}
					return ret
				}

				var queue=clone(data)

				count--
				console.log('2:'+count)
				if(count==0)
				{
					data=[]
					is_updated=false
				}
				
				res.send(queue)
				clearInterval(id)
			}
		},1000)
	}

	if(is_updated)
	{
		var id=setInterval(function()
		{
			if(!is_updated)
			{
				f()
				clearInterval(id)
			}
		}, 200)
	}
	else
	{
		f()
	}
})

app.listen(3000);