{ pkgs, lib, config, stdenv, domain, mkYarnPackage }:
stdenv.mkDerivation {
  name = "windshield";
  src = mkYarnPackage {
    name = "windshield-compressed";
    src = ./.;
  };

  buildPhase = ''
    mkdir -p ./decompressed

    ls -alh
    ls -alh tarballs
  
    cd decompressed 
    tar xf ../tarballs/windshield-compressed.tgz
  '';

  installPhase = ''
    mkdir -p $out/bin
    
    ls -alh
    cp -r ./package/src/* $out/bin
  '';
}
