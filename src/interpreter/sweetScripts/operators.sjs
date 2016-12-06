//TODO: Add Tests
operator (|) 13 left { $l, $r } => #{ _.pipeline($l, $r) }
export (|)

operator (|>) 5 right { $l, $r } => #{ $l | writeFile($r)}
export (|>)

macro strlist {
  case { _ $toks ... } => {
    return [makeValue(#{ $toks ... }.map(unwrapSyntax).join(', '), #{ here })];
  }
}

macro (exec) {
	rule { $func:ident $args:strlist} => {
		$func($args)
	}
}

/*operator (#) 13 { $r:ident } => #{ exec $r }

export (#)*/
export (exec)
