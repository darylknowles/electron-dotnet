using System; 
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

            long total = 0; 
            
            connection.On<long, long>("runloop", count => {                                
                for (long i = 0; i < count; i++) {
                    total++; 
                }
                return total; 
            });
            
            connection.Send("theAnswer", 42);
            
            connection.Listen();    
        }
    }
}
