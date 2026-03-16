---
title: The TD Sequential indicator
description: 'The TD Sequential indicator, developed by Tom Demark, is a technical analysis tool designed to identify potential turning points in the price of an asset.'
keywords:
  - econ
  - indicators strategies
  - td sequential indicator
  - td
  - sequential
  - indicator
  - developed
  - tom
---

## Basic

The TD Sequential indicator, developed by Tom Demark, is a technical analysis tool designed to identify potential turning points in the price of an asset. It consists of two main components: the TD Setup and the TD Countdown. Here's a breakdown of each component and how to use the TD Sequential indicator:

### TD Setup
The TD Setup identifies trends and potential reversal points through a sequence of consecutive price bars. 

- **Conditions**
    - **Buy Setup**: 
        - Occurs when there are nine consecutive closes lower than the close four bars earlier.
        - Example: Close[0] < Close[4], Close[1] < Close[5], ..., Close[8] < Close[12].
    - **Sell Setup**: 
        - Occurs when there are nine consecutive closes higher than the close four bars earlier.
        - Example: Close[0] > Close[4], Close[1] > Close[5], ..., Close[8] > Close[12].

### TD Countdown
The TD Countdown is a follow-up to the TD Setup, aiming to identify the exact point of trend exhaustion and potential reversal.

- **Conditions**
    - **Buy Countdown**:
        - After a Buy Setup, look for 13 closes that are lower or equal to the close two bars earlier.
        - The count continues even if there are interruptions in the sequence.
    - **Sell Countdown**:
        - After a Sell Setup, look for 13 closes that are higher or equal to the close two bars earlier.
        - The count continues despite interruptions in the sequence.

### Practical Examples and Strategies

- Bullish Reversal
    1. **Identify a Buy Setup**: Look for nine consecutive bars with each close lower than the close four bars earlier.
    2. **Verify Perfected Setup**: Check if the low of bar 8 or 9 is less than or equal to the lows of bars 6 and 7.
    3. **Count Down**: Start the Buy Countdown. Monitor for 13 bars closing lower than or equal to the close two bars earlier.
    4. **Confirm with Volume and Support**: Ensure there is increased volume and that the countdown completes near a known support level.
    5. **Enter Trade**: Upon completion of the Buy Countdown and confirmation, enter a long position.
    6. **Set Stop-Loss**: Place a stop-loss below the recent low.
- Bearish Reversal
    1. **Identify a Sell Setup**: Look for nine consecutive bars with each close higher than the close four bars earlier.
    2. **Verify Perfected Setup**: Check if the high of bar 8 or 9 is greater than or equal to the highs of bars 6 and 7.
    3. **Count Down**: Start the Sell Countdown. Monitor for 13 bars closing higher than or equal to the close two bars earlier.
    4. **Confirm with Volume and Resistance**: Ensure there is increased volume and that the countdown completes near a known resistance level.
    5. **Enter Trade**: Upon completion of the Sell Countdown and confirmation, enter a short position.
    6. **Set Stop-Loss**: Place a stop-loss above the recent high.

:::info Perfected Setups
- A "perfected" TD Setup occurs when:
  - For a Buy Setup, the low of bars 12 or 13 is less than or equal to the low of bars 10 and 11.
  - For a Sell Setup, the high of bars 12 or 13 is greater than or equal to the high of bars 10 and 11.
  - Perfected setups can provide stronger signals for trend exhaustion and potential reversal.
:::

:::info PAdditional Tips
- **Adjust Timeframes**: Experiment with different timeframes to see how TD Sequential behaves in various market conditions.
- **Patience and Discipline**: Wait for the TD Sequential to fully develop and confirm signals. Premature entries can lead to losses. (That said, mature entries don't imply the trade will success 100%, it just have higher chance)
- **Adaptability**: Market conditions change, and so should your application of TD Sequential. Adapt your strategy based on the current market environment.
:::


## Understanding TD Sequential in Depth

As an experienced trader, diving deeper into the nuances of the TD Sequential indicator can provide a richer understanding and potentially improve trading decisions. Here are some advanced insights and additional points to consider when using the TD Sequential

-  **Context and Market Conditions**
    - **Trend Identification**: The TD Sequential is most effective in trending markets. In choppy or sideways markets, signals may be less reliable.
    - **Timeframes**: While the TD Sequential can be applied to any timeframe, its effectiveness can vary. Typically, higher timeframes (daily, weekly) provide more reliable signals compared to lower timeframes (intraday charts).
-  **Countdown Adjustments (Strict vs. Lenient Counts)**
    - Some traders use stricter rules for counting valid bars in the TD Countdown
    - Strict: Each countdown bar must strictly close lower (for Buy Countdown) or higher (for Sell Countdown) than the close two bars earlier.
    - Lenient: Bars that close at the same level are also counted, making it easier to complete the countdown but possibly generating earlier signals.
-  **Combining with Other Indicators**
    - **Confirmation**: Combine TD Sequential signals with other indicators like MACD, RSI, or Bollinger Bands for confirmation.
    - **Volume Analysis**: Incorporate volume analysis to validate TD Sequential signals. For example, a Buy Countdown completion with a volume spike might indicate a more reliable reversal.
    - **Support and Resistance Levels**: Align TD Sequential signals with key support and resistance levels to enhance their reliability.

## Adapt the market 

Adaptability in trading involves adjusting your use of the TD Sequential indicator (and other tools) based on varying market conditions, timeframes, and other contextual factors. Here are some examples of how you can adapt the TD Sequential to different scenarios:

### Market Conditions

-  Trending Markets
    - **Strong Uptrend**:
        - **Adaptation**: In a strong uptrend, TD Sell Setups might occur frequently but may not always lead to significant reversals. Use them primarily for taking partial profits rather than exiting entirely.
        - **Example**: During a bull market, after a TD Sell Setup completes, rather than selling your entire position, you might reduce your exposure by selling a portion of your holdings while keeping the rest to ride the trend further.
    - **Strong Downtrend**:
        - **Adaptation**: In a strong downtrend, TD Buy Setups might indicate short-term bounces rather than a full reversal. Consider using these setups for short-term trades or to cover shorts.
        - **Example**: In a bear market, after a TD Buy Setup completes, you might enter a small long position to capitalize on a brief bounce or use it as a signal to cover some of your short positions.
-  Sideways / Ranging Markets
    - **Adaptation**: In a sideways market, the TD Sequential can be quite effective. Focus on identifying buy setups near the lower end of the range and sell setups near the upper end.
    - **Example**: If an asset is trading within a defined range, a TD Buy Setup near support levels can be used to enter a long position, and a TD Sell Setup near resistance can be used to enter a short position or exit a long position.

### Timeframes

-  **Short-Term Trading** (Intraday Trading)
    - **Adaptation**: On shorter timeframes (e.g., 5-minute or 15-minute charts), the TD Sequential can generate more signals, but these might be less reliable. Combine TD Sequential with other quick-acting indicators like moving averages or momentum oscillators.
    - **Example**: An intraday trader might use a TD Sell Setup on a 15-minute chart as an initial signal and wait for confirmation from a MACD crossover or a significant candlestick pattern before taking action.
-  **Long-Term Trading** (Daily/Weekly Charts)
    - **Adaptation**: On longer timeframes, TD Sequential signals are less frequent but more reliable. Use these signals for more significant position changes and align them with broader market analysis.
    - **Example**: On a weekly chart, a TD Buy Setup might signal a major market bottom. A trader might use this as a cue to enter a long-term investment position, especially if it aligns with positive fundamental analysis or macroeconomic trends.

### Asset Classes

-  **Stocks** (High Volatility Stocks)
    - **Adaptation**: For highly volatile stocks, TD Sequential setups might complete more frequently. Adjust the strictness of your setups and countdowns to filter out noise.
    - **Example**: With a volatile tech stock, consider using a stricter countdown (only count bars that strictly meet the criteria) to reduce false signals.
-  Forex
    - **Adaptation**: Forex markets often have strong trends driven by macroeconomic factors. Use TD Sequential in conjunction with fundamental analysis, such as interest rate decisions or geopolitical events.
    - **Example**: If a central bank announces a rate cut, a TD Buy Setup on the corresponding currency pair might signal a buying opportunity. Confirm this with other technical indicators and fundamental data.
-  **Cryptocurrencies** (Highly Speculative Assets)
    - **Adaptation**: Cryptocurrencies can exhibit extreme volatility and rapid trend changes. Use shorter timeframes and combine TD Sequential with volume indicators to gauge the strength of moves.
    - **Example**: For Bitcoin, a TD Sell Setup on a 4-hour chart might indicate a short-term correction in an overall bull market. Combine this with volume spikes to decide whether to take profits or hold.

### Strategy Adjustments

-  Combining with Other Indicators
    - **RSI and MACD**:
        - **Adaptation**: Use TD Sequential alongside RSI to confirm overbought or oversold conditions. A TD Buy Setup combined with an oversold RSI provides stronger confirmation of a potential reversal.
        - **Example**: If both TD Sequential and RSI indicate oversold conditions, and MACD shows a bullish crossover, this confluence increases the reliability of a buy signal.
-  Risk Management
    - **Position Sizing**:
        - **Adaptation**: Adjust your position size based on the strength and confirmation of the TD Sequential signal. Use smaller positions for initial setups and larger positions for completed countdowns with additional confirmation.
        - **Example**: If a TD Sell Setup completes but without strong confirmation from other indicators, enter a smaller short position. If the countdown completes and other indicators align, increase the position size.
-  Stop-Loss Adjustments
    - **Dynamic Stop-Loss**:
        - **Adaptation**: Use dynamic stop-loss levels that adjust based on the TD Sequential levels. For a Buy Setup, place stop-losses below the low of the setup period to minimize risk.
        - **Example**: If a TD Buy Setup completes on a daily chart, set a stop-loss just below the lowest low of the nine-bar setup sequence. Adjust this stop-loss dynamically if the price continues to develop favorably.

By adapting the TD Sequential indicator to different market conditions, timeframes, and asset classes, you can enhance its effectiveness and make more informed trading decisions. This adaptability allows you to better navigate the complexities of the financial markets and tailor your strategies to specific scenarios.