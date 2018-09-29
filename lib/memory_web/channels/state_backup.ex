# Not actually copied and pasted, but written with reference to the course notes
defmodule Memory.BackupAgent do
  use Agent

  def start_link(_args) do
    Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  def put(game_name, game_state) do
    Agent.update(__MODULE__, fn backup_map ->
      Map.put(backup_map, game_name, game_state)
    end)
  end

  def get(game_name) do
    Agent.get(__MODULE__, fn backup_map ->
      Map.get(backup_map, game_name)
    end)
  end
end
