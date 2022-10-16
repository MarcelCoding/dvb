{pkgs, lib, config, stdenv, domain, mkYarnPackage}:
mkYarnPackage {
  name = "windshield";
  src = ./.;
}
