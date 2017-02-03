//TODO: Add Tests
operator (|>) 13 left { $l, $r } => #{ _.pipe($l, $r) }
export (|>)

operator (>|) 5 right { $l, $r } => #{ $l |> $sys['writefile']($r, 'w')}
export (>|)

operator (>>|) 5 right { $l, $r } => #{ $l |> $sys['writefile']($r, 'a')}
export (>>|)
