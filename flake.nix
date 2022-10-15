{
  inputs = {
    nixpkgs.url = github:NixOS/nixpkgs/nixos-unstable;

    utils = {
      url = github:numtide/flake-utils;
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, utils, ... }:
    utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          package-production = pkgs.callPackage ./derivation.nix {
            domain = "dvb.solutions";
          };
          package-staging = pkgs.callPackage ./derivation.nix {
            domain = "staging.dvb.solutions";
          };
        in
        rec {
          checks = packages;
          packages = {
            windshield = package-production;
            windshield-staging = package-staging;
            default = package-production;
          };
        }
      ) // {
      overlays.default = final: prev: {
        inherit (self.packages.${prev.system})
          windshield
          windshield-staging;
      };
    };
}
