<!-- <template>
  <div>app</div>
</template> -->

<script>
export default {
  data() {
    return {
      a: 111,
      message: "999",
      msg: "Hello JSX",
      fontSize: "14px",
      show: true,
      inputValue: "99999990000",
    };
  },
  methods: {
    hello() {
      alert("Hello Vue 2.0");
    },
    clickHandler() {
      console.log("clickHandler");
    },
    nativeClickHandler() {},
    customEventHandler() {},
    onClickCell() {
      //   return () => {
      console.log("onClickCell", this.fontSize);
      //   };
    },
    changeFn(e) {
      //   console.log(e);
      this.inputValue = e.target.value;
      console.log(this.inputValue);
    },
  },
  render(h) {
    // nativeOnClick={this.nativeClickHandler}

    const data = {
      attrs: {
        id: "hehe",
      },
      on: {
        click: () => {
          console.log("click");
        },
      },
      props: {
        innerHTML: "hihihi",
      },
      hook: {
        insert: () => {
          console.log("insert");
        },
      },
    };
    // console.log(
    //   <span
    //     class={{ a: true, b: true }}
    //     style={{ fontSize: "15px" }}
    //     on-click={this.hello}
    //   >
    //     {this.msg}
    //   </span>
    // );
    return (
      <div>
        <div
          id="foo"
          v-show={this.show}
          propsOnCustomEvent={this.customEventHandler}
          // event listeners are prefixed with `on` or `nativeOn`
          onClick={this.clickHandler}
          // other special top-level properties
          class={{ foo: true, bar: false }}
          style={{ color: "red", fontSize: this.fontSize }}
          key="key"
          ref="ref"
        >
          {this.a}
        </div>
        <div
          onClick={() => this.onClickCell()} // DOM properties are prefixed with `domProps`
          domPropsInnerHTML="bar"
        ></div>
        <input value={this.inputValue} onInput={this.changeFn} />
        {/* <div onClick={this.clickHandler} {...data}>
          111
        </div> */}
        <div id="hi">
          <span
            class={{ a: true, b: true }}
            style={{ fontSize: "15px" }}
            on-click={this.hello}
          >
            {this.msg}
          </span>
        </div>
      </div>
    );
  },
};
</script>

<style></style>
