const net = require('net');
// const { serialize } = require('v8');

function customSerializes(data) 
{
    if (typeof data === 'string') 
    {
        return `$${data.length}\r\n${data}\r\n`;
    }
   else if( typeof data === "number")
    {
        return `:${data}\r\n`;
    }
   else if( Array.isArray(data))
    {
        let result = `*${data.length}\r\n`;
        for( let i = 0; i < data.length; i++)
        {
            result += customSerializes(data[i]);
        }
        return result;
    }
    else 
    {
        return `-${data}\r\n`;
    }
}






let store = {};
let expiration = {};
const server = net.createServer((socket) => {    
    console.log('Client connected');
    socket.on('data', (data) => {
        const message = data.toString().trim();
        console.log('Data received from client: ' + message);
        const parts = message.split(' ');
        let command = parts[0].toUpperCase();
        // if( data === 'PING')
        // {
        //     socket.write(serialize('PONG'));
        // }
        // else if (message === 'ECHO')
        //      {
           
        //     socket.write(serialize('Hello World'));
        // }
         if( command === 'SET')
        {
            let ttl = null;
            store[parts[1]] = parts[2];   
            socket.write(customSerializes('OK'));  

            if( parts.includes('EX'))
            {
                let index = parts.indexOf('EX');
                ttl = parseInt(parts[index+1] , 10)*1000;
            }
            else if( parts.includes('PX'))
            {
                let index = parts.indexOf('PX');
                ttl = parseInt(parts[index+1] , 10);
            }
            if( ttl != null)
            {
                expiration[parts[1]] = Date.now() + ttl;
                console.log(`key: ${parts[1]} Expiry Time : ${expiration[parts[1]]} , current time: ${ Date.now()}`);
            }
        }

        else if( command === 'GET')
        {
            if(  expiration[parts[1]] && expiration[parts[1]] < Date.now())
            {
                console.log(`GET key: ${parts[1]}, Expiry: ${expiration[parts[1]]}, Current Time: ${Date.now()}`);
                delete store[parts[1]];
                delete expiration[parts[1]];
                socket.write(customSerializes('null'));
            }
            else if (store[parts[1]]) 
            {
                console.log(`GET command executed. Key: ${parts[1]}, Value: ${store[parts[1]]}`);
                socket.write(customSerializes(store[parts[1]]));
            } 
            else 
            {
                console.log(`GET command executed. Key: ${parts[1]} not found or expired.`);
                socket.write(customSerializes('null'));
            }
        
        }
        
        else if( command === 'DEL')
        {
            let delcount = 0;
            for( let i = 1; i < parts.length; i++)
            {
                if( store[parts[i]])
                {
                    delete store[parts[i]];
                    delete expiration[parts[i]];
                    socket.write(customSerializes('OK'));
                }
                else
                {
                    socket.write(customSerializes('null'));
                }
                delcount++;
            }
            socket.write(customSerializes(delcount));
            
        }

        else if (command === 'EXISTS') 
        {
            if (store[parts[1]]) {
                socket.write(customSerializes(1)); 
            } else {
                socket.write(customSerializes(0)); 
            }
        }
        else if( command === 'INCR')
        {
            if( store[parts[1]] && !NaN(store[parts[1]]))
            {
                store[parts[1]] = parseInt(store[parts[1]], 10) + 1;
                socket.write(customSerializes(store[parts[1]]));
            }
        }
        else if( command === 'DECR')
        {
                if( store[parts[1]] && !NaN(store[parts[1]]))
                {
                    store[parts[1]] = parseInt(store[parts[1]], 10) - 1;
                    socket.write(customSerializes(store[parts[1]]));
                }
        }
        else if( command === 'LPUSH')
        {
            if( !ArrayisArray(store[parts[1]]))
            {
                store[parts[1]] = [];
            }
             store[parts[1]].unshift(...parts.slice(2));
             socket.write(customSerializes(store[parts[1]].length));
        }
        else if( command === 'RPUSH')
        {
            if( !ArrayisArray(store[parts[1]]))
            {
                store[parts[1]] = [];
            }
            store[parts[1]].push(...parts.slice(2));
            socket.write(customSerializes(store[parts[1]].length));
        }
        else if( command === 'LPOP')
        {
            if( !ArrayisArray(store[parts[1]]))
            {
                store[parts[1]] = [];
            }
            let value = store[parts[1]].shift();
            socket.write(customSerializes(value));
        }
        else 
        {
            socket.write(customSerializes('ERROR: Unknown command'));
        }

    });

    socket.on('end', () => {
        console.log('Client disconnected');
    });
    socket.write(customSerializes('Welcome to the server!'));
});




server.listen( 6379, () => { 
    console.log('Server started on port 6379');
});

