cd src/Twitr.Business

dotnet build -v q
sh ../../../../../buildrnet/scripts/buildr.sh \
    /Users/cdeniz/Projects/gazel/open-schema/samples/twitr/business/schema/twitr.view.json \
    /Users/cdeniz/Projects/gazel/open-schema/samples/twitr/business/src/Twitr.Business/bin/Debug/netstandard2.0/Twitr.Business.dll

cd ../../meta

node build.js
cd ..

cd src/Twitr.Grpc

dotnet build -v q

cd ..