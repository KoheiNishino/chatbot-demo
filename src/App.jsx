import React from "react";
import './assets/styles/style.css';
import {AnswersList, Chats} from "./components/index";
import FormDialog from "./components/Forms/FormDialog";
import {db} from "./firebase/index";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [],                  // 回答コンポーネントに表示するデータ
      chats: [],                    // チャットコンポーネントに表示するデータ
      currentId: "init",            // 現在の質問ID
      dataset: {},                  // 質問と回答のデータセット
      open: false                   // 問い合わせフォーム用モーダルの開閉を管理
    }
    this.selectAnswer = this.selectAnswer.bind(this)
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClickClose = this.handleClickClose.bind(this);
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
      case (nextQuestionId === "init"):
        debugger
        setTimeout(() => this.displayNextQuestion(nextQuestionId), 500);
        break;

      case (nextQuestionId === 'contact'):
        this.handleClickOpen();
        break;

      case (/^https:*/.test(nextQuestionId)):
        const a = document.createElement('a');
        a.href = nextQuestionId;
        a.target = '_blank';
        a.click();
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

        setTimeout(() => this.displayNextQuestion(nextQuestionId), 1000);
        break;
    }
  }

  handleClickOpen = () => {
    this.setState({open: true});
  }

  handleClickClose = () => {
    this.setState({open: false});
  }

  initDataset = (dataset) => {
    this.setState({dataset: dataset});
  }

  componentDidMount() {
    (async() => {
      const dataset = this.state.dataset;

      await db.collection('questions').get().then(snapshots => {
        snapshots.forEach(doc => {
          const id = doc.id;
          const data = doc.data();
          dataset[id] = data;
        })
      });

      this.initDataset(dataset);
      const initAnswer = "";
      this.selectAnswer(initAnswer, this.state.currentId)
    })()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const scrollArea = document.getElementById('scroll-area');
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }

  render() {
    return (
      <section className="c-section">
        <div className="c-box">
          <Chats chats={this.state.chats} />
          <AnswersList answers={this.state.answers} select={this.selectAnswer} />
          <FormDialog open={this.state.open} handleClose={this.handleClickClose} />
        </div>
      </section>
    );
  }
}
