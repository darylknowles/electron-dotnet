﻿using System; 
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

            var total = 0; 
            
            connection.On<int, string>("runloop", count => {                                
                for (var i = 0; i < count; i++) {
                    total++; 
                }
                return $"Done with {total} interations"; 
            });
            
            connection.Listen();    
        }
    }
}