using System;
using System.IO;
using System.Reflection;
using System.Linq;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace Buildr
{
    public static class Program
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
                Assembly = args.Skip(1).Select(path => Assembly.LoadFile(path)).ToDynamic()
            };

            var jsonString = JsonConvert.SerializeObject(json, Formatting.Indented);

            if (File.Exists(args[0]))
            {
                File.Delete(args[0]);
            }

            File.WriteAllText(args[0], jsonString);

            Console.WriteLine($"Json written to {args[0]}");
        }

        private static dynamic ToDynamic(this IEnumerable<Assembly> source)
        {
            var list = source.ToList();

            return list.Select((assembly, index) => new
            {
                _first = index == 0,
                _last = index == list.Count - 1,
                _key = assembly.GetName().Name,
                Type = assembly.GetExportedTypes().ToDynamic()
            });
        }

        private static dynamic ToDynamic(this IEnumerable<Type> source)
        {
            var list = source.ToList();
            return list.Select((type, index) => new
            {
                _first = index == 0,
                _last = index == list.Count - 1,
                _key = FixTypeName(type.Name),
                Namespace = type.Namespace,
                FullName = FixTypeName(type.FullName),
                IsGeneric = type.IsGenericType,
                Constructor = type.GetConstructors().ToDynamic(),
                Property = type.GetProperties().ToDynamic(),
                Method = type.GetMethods().Where(method => !method.IsSpecialName && !FromObject(method)).ToDynamic(),
                CustomAttribute = type.CustomAttributes.Select(attr => attr.AttributeType.Name)
            });
        }

        private static dynamic ToDynamic(this IEnumerable<ConstructorInfo> source)
        {
            var list = source.ToList();

            return list.Select((constructor, index) => new
            {
                _first = index == 0,
                _last = index == list.Count - 1,
                Parameter = constructor.GetParameters().ToDynamic(),
                CustomAttribute = constructor.CustomAttributes.Select(attr => attr.AttributeType.Name)
            });
        }

        private static dynamic ToDynamic(this IEnumerable<PropertyInfo> source)
        {
            var list = source.ToList();

            return list.Select((property, index) => new
            {
                _first = index == 0,
                _last = index == list.Count - 1,
                _key = property.Name,
                PropertyType = Ref(property.PropertyType),
                CustomAttribute = property.CustomAttributes.Select(attr => attr.AttributeType.Name)
            });
        }

        private static dynamic ToDynamic(this IEnumerable<MethodInfo> source)
        {
            var list = source.ToList();

            return list.Select((method, index) => new
            {
                _first = index == 0,
                _last = index == list.Count - 1,
                _key = method.Name,
                ReturnType = Ref(method.ReturnType),
                Parameter = method.GetParameters().ToDynamic(),
                CustomAttribute = method.CustomAttributes.Select(attr => attr.AttributeType.Name)
            });
        }

        private static dynamic ToDynamic(this IEnumerable<ParameterInfo> source)
        {
            var list = source.ToList();

            return list.Select((parameter, index) => new
            {
                _first = index == 0,
                _last = index == list.Count - 1,
                _key = parameter.Name,
                ParameterType = Ref(parameter.ParameterType),
                CustomAttribute = parameter.CustomAttributes.Select(attr => attr.AttributeType.Name)
            });
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
                GenericArgument = type.GetGenericArguments().Select(Ref)
            };
        }

        static string FixTypeName(string name) => name.Split("`")[0];

        static bool FromObject(MethodInfo method) => method.Name == "Equals" || method.Name == "GetHashCode" || method.Name == "GetType" || method.Name == "ToString";
    }
}
