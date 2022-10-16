let
  nodeDependencies = (pkgs.callPackage ./default.nix {}).nodeDependencies;
in

stdenv.mkDerivation {
  name = "windshield";
  src = ./.;
  buildInputs = [nodejs];
  buildPhase = ''
    ln -s ${nodeDependencies}/lib/node_modules ./node_modules
    export PATH="${nodeDependencies}/bin:$PATH"

    # Build the distribution bundle in "dist"
    ng build

    cp -r dist $out/
  '';
}
