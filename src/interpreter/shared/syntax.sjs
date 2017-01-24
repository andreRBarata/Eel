//TODO: Add Tests
operator (|>) 13 left { $l, $r } => #{ _.pipeline($l, $r) }
export (|>)

operator (>|) 5 right { $l, $r } => #{ $l |> fs.createWriteStream($r, {flags: 'w'})}
export (>|)

operator (>>|) 5 right { $l, $r } => #{ $l |> fs.createWriteStream($r, {flags: 'a'})}
export (>>|)
