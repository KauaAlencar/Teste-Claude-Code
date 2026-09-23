import { Composition, Folder } from "remotion";
import { PrimeiroParceiro } from "./primeiro/PrimeiroParceiro";
import { Scene1Quarto } from "./primeiro/scenes/Scene1Quarto";
import { Scene2Relogio } from "./primeiro/scenes/Scene2Relogio";
import { Scene3Transicao } from "./primeiro/scenes/Scene3Transicao";
import { Scene4Acorda } from "./primeiro/scenes/Scene4Acorda";
import { Scene5Cidade } from "./primeiro/scenes/Scene5Cidade";
import { Scene6Laboratorio } from "./primeiro/scenes/Scene6Laboratorio";
import { Scene7Escolha } from "./primeiro/scenes/Scene7Escolha";
import { Scene8Fumaca } from "./primeiro/scenes/Scene8Fumaca";
import { Scene9Continua } from "./primeiro/scenes/Scene9Continua";
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
        id="OPrimeiroParceiro"
        component={PrimeiroParceiro}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="PrimeiroParceiro-Cenas">
        <Composition id="PP1-Quarto" component={Scene1Quarto} durationInFrames={360} fps={30} width={1920} height={1080} />
        <Composition id="PP2-Relogio" component={Scene2Relogio} durationInFrames={120} fps={30} width={1920} height={1080} />
        <Composition id="PP3-Pixelizacao" component={Scene3Transicao} durationInFrames={120} fps={30} width={1920} height={1080} />
        <Composition id="PP4-Acorda" component={Scene4Acorda} durationInFrames={240} fps={30} width={1920} height={1080} />
        <Composition id="PP5-Cidade" component={Scene5Cidade} durationInFrames={240} fps={30} width={1920} height={1080} />
        <Composition id="PP6-Laboratorio" component={Scene6Laboratorio} durationInFrames={240} fps={30} width={1920} height={1080} />
        <Composition id="PP7-Escolha" component={Scene7Escolha} durationInFrames={240} fps={30} width={1920} height={1080} />
        <Composition id="PP8-Fumaca" component={Scene8Fumaca} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="PP9-Continua" component={Scene9Continua} durationInFrames={90} fps={30} width={1920} height={1080} />
      </Folder>
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
