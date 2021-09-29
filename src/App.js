import react from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

class App extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      manager: "",
      players: [],
      balance: "",
      value: "",
      status: "",
    };
  }
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }
  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    this.setState({ status: "validating on Ethereum network..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ status: "Success!" });
  };
  pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ status: "validating on Ethereum network..." });
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    this.setState({ status: "Success!" });
  };
  render() {
    return (
      <div>
        <h2> Prize Pool App </h2>
        <h3>
          {" "}
          This application communicates Metamask to get your address info.
          Please install it in your browser.
        </h3>
        <p> Contract Owner: {this.state.manager} </p>
        <p>
          Currently {this.state.players.length} player(s) have been
          participated.
        </p>
        <p>
          Total amount of collected moeny is:{" "}
          {web3.utils.fromWei(this.state.balance, "ether")}
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h3>
            * If you want to participate, you need to submit minimum of 0.01
            ether.
          </h3>
          <div>
            <label htmlFor="">Amount of ether you want to put in </label>
            <input
              type="text"
              value={this.state.value}
              onChange={(event) => {
                this.setState({ value: event.target.value });
              }}
            />
          </div>
          <button>Submit</button>
        </form>
        <hr />
        <h3>Pick a winner</h3>
        <button onClick={this.pickWinner}></button>
        <hr />
        <h2>{this.state.status}</h2>
      </div>
    );
  }
}

export default App;
