using System; 
using System.Threading;
using ElectronCgi.DotNet;

namespace Core
{
    class Program
    {
        static void Main(string[] args)
        {
            // Create connection with js process (intercepts stdin/stdout)
            var connection = new ConnectionBuilder()
                .WithLogging()
                .Build();
            
            // Handle the "greeting" request from js code.  Take string 'name' and returns string with Hello prepended to name.              
            connection.On<string, string>("greeting", name => "Hello " + name);
            
            // Starts a loop from 0 to count, sends the current counter back to js process via Send() for each iteration.  Return count back to caller in js. 
            connection.On<long, long>("runloop", count => {                                
                for (long i = 0; i < count; i++) {
                    connection.Send("currentCount",i);           
                    Thread.Sleep(millisecondsTimeout: 1);                                 
                }
                return count; 
            });
            
            // Initiate request to update "currentCount" display back in calling js process. 
            connection.Send("currentCount", 42);
            
            // Start listening for messages from js process.
            connection.Listen();    
        }
    }
}
