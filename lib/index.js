/**
 * EXPORT COMPONENTS
 */
export { default as activeRingChart } from './components/activeRingChart/index'
export { default as borderBox1 } from './components/borderBox1/index'
export { default as borderBox10 } from './components/borderBox10/index'
export { default as borderBox11 } from './components/borderBox11/index'
export { default as borderBox12 } from './components/borderBox12/index'
export { default as borderBox13 } from './components/borderBox13/index'
export { default as borderBox2 } from './components/borderBox2/index'
export { default as borderBox3 } from './components/borderBox3/index'
export { default as borderBox4 } from './components/borderBox4/index'
export { default as borderBox5 } from './components/borderBox5/index'
export { default as borderBox6 } from './components/borderBox6/index'
export { default as borderBox7 } from './components/borderBox7/index'
export { default as borderBox8 } from './components/borderBox8/index'
export { default as borderBox9 } from './components/borderBox9/index'
export { default as capsuleChart } from './components/capsuleChart/index'
export { default as charts } from './components/charts/index'
export { default as conicalColumnChart } from './components/conicalColumnChart/index'
export { default as decoration1 } from './components/decoration1/index'
export { default as decoration10 } from './components/decoration10/index'
export { default as decoration11 } from './components/decoration11/index'
export { default as decoration12 } from './components/decoration12/index'
export { default as decoration2 } from './components/decoration2/index'
export { default as decoration3 } from './components/decoration3/index'
export { default as decoration4 } from './components/decoration4/index'
export { default as decoration5 } from './components/decoration5/index'
export { default as decoration6 } from './components/decoration6/index'
export { default as decoration7 } from './components/decoration7/index'
export { default as decoration8 } from './components/decoration8/index'
export { default as decoration9 } from './components/decoration9/index'
export { default as digitalFlop } from './components/digitalFlop/index'
export { default as flylineChart } from './components/flylineChart/index'
export { default as flylineChartEnhanced } from './components/flylineChartEnhanced/index'
export { default as fullScreenContainer } from './components/fullScreenContainer/index'
export { default as loading } from './components/loading/index'
export { default as percentPond } from './components/percentPond/index'
export { default as scrollBoard } from './components/scrollBoard/index'
export { default as scrollRankingBoard } from './components/scrollRankingBoard/index'
export { default as waterLevelPond } from './components/waterLevelPond/index'
/**
 * export {default as COMPONENTS}
 */
export { default as fullScreenContainer } from "./components/fullScreenContainer/index";
export { default as loading } from "./components/loading/index";

// border box
export { default as borderBox1 } from "./components/borderBox1/index";
export { default as borderBox2 } from "./components/borderBox2/index";
export { default as borderBox3 } from "./components/borderBox3/index";
export { default as borderBox4 } from "./components/borderBox4/index";
export { default as borderBox5 } from "./components/borderBox5/index";
export { default as borderBox6 } from "./components/borderBox6/index";
export { default as borderBox7 } from "./components/borderBox7/index";
export { default as borderBox8 } from "./components/borderBox8/index";
export { default as borderBox9 } from "./components/borderBox9/index";
export { default as borderBox10 } from "./components/borderBox10/index";
export { default as borderBox11 } from "./components/borderBox11/index";
export { default as borderBox12 } from "./components/borderBox12/index";
export { default as borderBox13 } from "./components/borderBox13/index";

// decoration
export { default as decoration1 } from "./components/decoration1/index";
export { default as decoration2 } from "./components/decoration2/index";
export { default as decoration3 } from "./components/decoration3/index";
export { default as decoration4 } from "./components/decoration4/index";
export { default as decoration5 } from "./components/decoration5/index";
export { default as decoration6 } from "./components/decoration6/index";
export { default as decoration7 } from "./components/decoration7/index";
export { default as decoration8 } from "./components/decoration8/index";
export { default as decoration9 } from "./components/decoration9/index";
export { default as decoration10 } from "./components/decoration10/index";
export { default as decoration11 } from "./components/decoration11/index";
export { default as decoration12 } from "./components/decoration12/index";

// charts
export { default as charts } from "./components/charts/index";

export { default as activeRingChart } from "./components/activeRingChart";
export { default as capsuleChart } from "./components/capsuleChart";
export { default as waterLevelPond } from "./components/waterLevelPond/index";
export { default as percentPond } from "./components/percentPond/index";
export { default as flylineChart } from "./components/flylineChart";
export { default as flylineChartEnhanced } from "./components/flylineChartEnhanced";
export { default as conicalColumnChart } from "./components/conicalColumnChart";
export { default as digitalFlop } from "./components/digitalFlop";
export { default as scrollBoard } from "./components/scrollBoard/index";
export { default as scrollRankingBoard } from "./components/scrollRankingBoard/index";

/**
 * USE COMPONENTS
 */
export default function (Vue) {
  Vue.use(fullScreenContainer);
  Vue.use(loading);

  // border box
  Vue.use(borderBox1);
  Vue.use(borderBox2);
  Vue.use(borderBox3);
  Vue.use(borderBox4);
  Vue.use(borderBox5);
  Vue.use(borderBox6);
  Vue.use(borderBox7);
  Vue.use(borderBox8);
  Vue.use(borderBox9);
  Vue.use(borderBox10);
  Vue.use(borderBox11);
  Vue.use(borderBox12);
  Vue.use(borderBox13);

  // decoration
  Vue.use(decoration1);
  Vue.use(decoration2);
  Vue.use(decoration3);
  Vue.use(decoration4);
  Vue.use(decoration5);
  Vue.use(decoration6);
  Vue.use(decoration7);
  Vue.use(decoration8);
  Vue.use(decoration9);
  Vue.use(decoration10);
  Vue.use(decoration11);
  Vue.use(decoration12);

  // charts
  Vue.use(charts);

  Vue.use(activeRingChart);
  Vue.use(capsuleChart);
  Vue.use(waterLevelPond);
  Vue.use(percentPond);
  Vue.use(flylineChart);
  Vue.use(flylineChartEnhanced);
  Vue.use(conicalColumnChart);
  Vue.use(digitalFlop);
  Vue.use(scrollBoard);
  Vue.use(scrollRankingBoard);
}
