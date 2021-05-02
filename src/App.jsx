import React from "react";
import defaultDataset from "./dataset";
import './assets/styles/style.css';
import {AnswersList, Chats} from "./components/index";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [],                  // 回答コンポーネントに表示するデータ
      chats: [],                    // チャットコンポーネントに表示するデータ
      currentId: "init",            // 現在の質問ID
      dataset: defaultDataset,      // 質問と回答のデータセット
      open: false                   // 問い合わせフォーム用モーダルの開閉を管理
    }
    this.selectAnswer = this.selectAnswer.bind(this)
  }

  displayNextQuestion = (nextQuestionId) => {
    const chats = this.state.chats;
    chats.push({
      text: this.state.dataset[nextQuestionId].question,
      type: 'question',
    })

    this.setState({
      answers: this.state.dataset[nextQuestionId].answers,
      chats: chats,
      currentId: nextQuestionId,
    })
  }

  selectAnswer = (selectedAnswer, nextQuestionId) => {
    switch(true) {
      case (nextQuestionId === 'init'):
        this.displayNextQuestion(nextQuestionId)
        break;
      default:
        const chats = this.state.chats;
        chats.push({
          text: selectedAnswer,
          type: 'answer'
        })

        this.setState({
          // 下記のように配列のstateに対して直接pushして状態を変更することは出来ない
          // NG: chats: this.state.chats.push(chat)
          chats: chats
        })

        this.displayNextQuestion(nextQuestionId)
        break;
    }
  }

  componentDidMount() {
    const initAnswer = '';
    this.selectAnswer(initAnswer, this.state.currentId)
  }

  render() {
    return (
      <section className="c-section">
        <div className="c-box">
          <Chats chats={this.state.chats} />
          <AnswersList answers={this.state.answers} select={this.selectAnswer} />
        </div>
      </section>
    );
  }
}
