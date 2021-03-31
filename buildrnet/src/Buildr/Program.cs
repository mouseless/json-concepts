using System;
using System.IO;
using System.Reflection;
using System.Linq;
using Newtonsoft.Json;

namespace Buildr
{
    public class Program
    {
        static void Main(string[] args)
        {
            if (args.Length <= 0)
            {
                var old = Console.ForegroundColor;
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("ERROR: Output file path and specify assembly paths.");
                Console.ForegroundColor = old;
                Environment.Exit(1);
                return;
            }

            if (args.Length <= 1)
            {
                var old = Console.ForegroundColor;
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("ERROR: Specify assembly paths.");
                Console.ForegroundColor = old;
                Environment.Exit(1);
                return;
            }

            Console.WriteLine($"Assemblies are: {string.Join(", ", args.Skip(1))}");

            var json = new
            {
                Assemblies = args.Skip(1).Select(path => Assembly.LoadFile(path)).Select(assembly => new
                {
                    Name = assembly.GetName().Name,
                    Types = assembly.GetExportedTypes().Select(type => new
                    {
                        Name = FixTypeName(type.Name),
                        Namespace = type.Namespace,
                        FullName = FixTypeName(type.FullName),
                        IsGeneric = type.IsGenericType,
                        Constructors = type.GetConstructors().Select(constructor => new
                        {
                            Parameters = constructor.GetParameters().Select(parameter => new
                            {
                                Name = parameter.Name,
                                ParameterType = Ref(parameter.ParameterType),
                                CustomAttributes = parameter.CustomAttributes.Select(attr => attr.AttributeType.Name)
                            }),
                            CustomAttributes = constructor.CustomAttributes.Select(attr => attr.AttributeType.Name)
                        }),
                        Properties = type.GetProperties().Select(property => new
                        {
                            Name = property.Name,
                            PropertyType = Ref(property.PropertyType),
                            CustomAttributes = property.CustomAttributes.Select(attr => attr.AttributeType.Name)
                        }),
                        Methods = type.GetMethods().Where(method => !method.IsSpecialName && !FromObject(method)).Select(method => new
                        {
                            Name = method.Name,
                            ReturnType = Ref(method.ReturnType),
                            Parameters = method.GetParameters().Select(parameter => new
                            {
                                Name = parameter.Name,
                                ParameterType = Ref(parameter.ParameterType),
                                CustomAttributes = parameter.CustomAttributes.Select(attr => attr.AttributeType.Name)
                            }),
                            CustomAttributes = method.CustomAttributes.Select(attr => attr.AttributeType.Name)
                        }),
                        CustomAttributes = type.CustomAttributes.Select(attr => attr.AttributeType.Name)
                    })
                })
            };

            var jsonString = JsonConvert.SerializeObject(json, Formatting.Indented);

            if (File.Exists(args[0]))
            {
                File.Delete(args[0]);
            }

            File.WriteAllText(args[0], jsonString);

            Console.WriteLine($"Json written to {args[0]}");
        }

        static dynamic Ref(Type type)
        {
            if (!type.IsGenericType)
            {
                return new
                {
                    IsGeneric = false,
                    Name = type.FullName
                };
            }

            return new
            {
                IsGeneric = true,
                Name = FixTypeName(type.GetGenericTypeDefinition().FullName),
                GenericArguments = type.GetGenericArguments().Select(Ref)
            };
        }

        static string FixTypeName(string name) => name.Split("`")[0];

        static bool FromObject(MethodInfo method) => method.Name == "Equals" || method.Name == "GetHashCode" || method.Name == "GetType" || method.Name == "ToString";
    }
}
