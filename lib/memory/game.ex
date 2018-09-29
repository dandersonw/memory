defmodule Memory.Game do
  require Logger
  @moduledoc false
  @constants %{gridWidth: 4, gridHeight: 4}

  def new do
    letters = 0..(@constants.gridWidth * @constants.gridHeight - 1)
    |> Enum.map(fn i -> to_string([div(i, 2) + ?A]) end)
    |> Enum.shuffle

    cells = for r <- 0..(@constants.gridHeight - 1),
      c <- 0..(@constants.gridWidth - 1), into: %{} do
          {[r, c], Enum.fetch!(letters, r * @constants.gridWidth + c)}
    end
    %{
      cells: cells,
      guesses: [],
      coolingOffPeriod: false,
      clicks: 0
    }
  end

  def client_view(game) do
    cellsView = for r <- 0..(@constants.gridHeight - 1),
      c <- 0..(@constants.gridWidth - 1) do
        if (Enum.member?(game.guesses, [r, c]) or game.cells[[r, c]] == "") do
          game.cells[[r, c]]
        else
          "?"
        end
    end
    %{
      cells: Enum.chunk_every(cellsView, @constants.gridWidth),
      numGuesses: length(game.guesses),
      coolingOffPeriod: game.coolingOffPeriod,
      clicks: game.clicks
    }
  end

  def guess(game, r, c) do
    if (length(game.guesses) < 2)
    and r < @constants.gridHeight and r >= 0
    and c < @constants.gridWidth and c >= 0
    and game.cells[[r, c]] != "" do
      new_state = Map.merge(game, %{guesses: game.guesses ++ [[r, c]],
        coolingOffPeriod: length(game.guesses) == 1,
        clicks: game.clicks + 1})
      # Logger.info new_state
      {:ok, new_state}
    else
      :error
    end
  end

  def maybe_resolve_guesses(game) do
    if (length(game.guesses) == 2) do
      guess_a = Enum.fetch!(game.guesses, 0)
      guess_b = Enum.fetch!(game.guesses, 1)
      match = game.cells[guess_a] == game.cells[guess_b]
      new_state = Map.put(game, :guesses, [])
      |> Map.put(:coolingOffPeriod, false)

      if (match) do
        new_cells = for {key, value} <- game.cells, into: %{} do
          if (Enum.member?(game.guesses, key)) do
            {key, ""}
          else
            {key, value}
          end
        end
        Map.put(new_state, :cells, new_cells)
      else
        new_state
      end
    else
      game
    end
  end
end
