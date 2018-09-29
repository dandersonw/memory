defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game
  alias Memory.BackupAgent

  # Changes taken from course notes
  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Memory.BackupAgent.get(name) || Game.new()
      socket = socket
      |> assign(:name, name)
      |> assign(:game, game)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # # Channels can be used in a request/response fashion
  # # by sending replies to requests from the client
  # def handle_in("ping", payload, socket) do
  #   {:reply, {:ok, payload}, socket}
  # end

  # # It is also common to receive messages from the client and
  # # broadcast to everyone in the current topic (games:lobby).
  # def handle_in("shout", payload, socket) do
  #   broadcast socket, "shout", payload
  #   {:noreply, socket}
  # end

  def handle_in("guess", %{"r" => r, "c" => c}, socket) do
    case Game.guess(socket.assigns[:game], r, c) do
      {:ok, new_state} ->
        next_state = Game.maybe_resolve_guesses(new_state)
        socket = assign(socket, :game, next_state)
        BackupAgent.put(socket.assigns[:name], socket.assigns[:game])
        {:reply, {:ok, %{ "game" => Game.client_view(new_state)}}, socket}
      :error ->
        {:reply, {:error, %{}}} # TODO: give reason for failure?
    end
  end

  def handle_in("refresh", payload, socket) do
    {:reply, {:ok, %{ "game" => Game.client_view(socket.assigns[:game])}}, socket}
  end
  
  def handle_in("restart", payload, socket) do
    socket = assign(socket, :game, Game.new())
    BackupAgent.put(socket.assigns[:name], socket.assigns[:game])
    {:reply, {:ok, %{ "game" => Game.client_view(socket.assigns[:game])}}, socket}
  end
  
  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
