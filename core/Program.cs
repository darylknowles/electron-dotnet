using System; 
using System.Threading;
using ElectronCgi.DotNet;

namespace Core
{
    class Program
    {
        static void Main(string[] args)
        {
            var connection = new ConnectionBuilder()
                .WithLogging()
                .Build();
            
            connection.On<string, string>("greeting", name => "Hello " + name);
            
            connection.On<long, long>("runloop", count => {                                
                for (long i = 0; i < count; i++) {
                    connection.Send("currentCount",i);           
                    Thread.Sleep(1000);                                 
                }
                return count; 
            });
            
            connection.Send("currentCount", 42);
            
            connection.Listen();    
        }
    }
}
