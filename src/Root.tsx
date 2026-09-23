import { Composition, Folder } from "remotion";
import { Fable } from "./fable/Fable";
import { Scene1Abertura } from "./fable/scenes/Scene1Abertura";
import { Scene2Fazenda } from "./fable/scenes/Scene2Fazenda";
import { Scene3Tentativa } from "./fable/scenes/Scene3Tentativa";
import { Scene4Buraco } from "./fable/scenes/Scene4Buraco";
import { Scene5Plano } from "./fable/scenes/Scene5Plano";
import { Scene6Troca } from "./fable/scenes/Scene6Troca";
import { Scene7Estrela } from "./fable/scenes/Scene7Estrela";
import { Scene8Encerramento } from "./fable/scenes/Scene8Encerramento";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OCavaloQueLiaMentes"
        component={Fable}
        durationInFrames={2250}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="Cenas">
        <Composition id="Cena1-Abertura" component={Scene1Abertura} durationInFrames={255} fps={30} width={1920} height={1080} />
        <Composition id="Cena2-Fazenda" component={Scene2Fazenda} durationInFrames={330} fps={30} width={1920} height={1080} />
        <Composition id="Cena3-Tentativa" component={Scene3Tentativa} durationInFrames={270} fps={30} width={1920} height={1080} />
        <Composition id="Cena4-Buraco" component={Scene4Buraco} durationInFrames={390} fps={30} width={1920} height={1080} />
        <Composition id="Cena5-Plano" component={Scene5Plano} durationInFrames={390} fps={30} width={1920} height={1080} />
        <Composition id="Cena6-Troca" component={Scene6Troca} durationInFrames={390} fps={30} width={1920} height={1080} />
        <Composition id="Cena7-Estrela" component={Scene7Estrela} durationInFrames={270} fps={30} width={1920} height={1080} />
        <Composition id="Cena8-Encerramento" component={Scene8Encerramento} durationInFrames={165} fps={30} width={1920} height={1080} />
      </Folder>
    </>
  );
};
