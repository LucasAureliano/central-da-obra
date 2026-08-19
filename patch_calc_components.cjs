const fs = require('fs');

const path = 'src/components/public/PublicCalculatorView.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  "import { TileCalc } from '../calculators_library/TileCalc';",
  "import { FloorTileCalc as TileCalc } from '../calculators_library/FloorTileCalc';"
);
code = code.replace(
  "import { ConcreteVolumeCalc } from '../calculators_library/ConcreteVolumeCalc';",
  "import { ConcreteMixCalc as ConcreteVolumeCalc } from '../calculators_library/ConcreteMixCalc';"
);
code = code.replace(
  "import { PaintCalc } from '../calculators_library/PaintCalc';",
  "import { WallPaintCalc as PaintCalc } from '../calculators_library/WallPaintCalc';"
);

fs.writeFileSync(path, code, 'utf8');
