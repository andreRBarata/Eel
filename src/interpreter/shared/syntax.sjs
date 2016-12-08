//TODO: Add Tests
operator (|) 13 left { $l, $r } => #{ _.pipeline($l, $r) }
export (|)

operator (|>) 5 right { $l, $r } => #{ $l | writeFile($r)}
export (|>)

macro arg {
	case {_ $arg:ident } => {
		letstx $tok_str = [makeValue(unwrapSyntax(#{$arg}), #{ here })];
		return #{$tok_str}
	}
	case {_ $arg:lit } => {
		letstx $tok_str = [makeValue(unwrapSyntax(#{$arg}), #{ here })];
		return #{$tok_str}
	}
	case {_ $arg:expr } => {
		letstx $tok_str = [makeValue(unwrapSyntax(#{$arg}), #{ here })];
		return #{$tok_str}
	}
	case {_ ${$arg:ident} } => {
		return #{$arg}
	}
}

/*macro strlist {
  case { _ $toks ... } => {
    return [makeValue(#{ $toks ... }.map(unwrapSyntax).join(','), #{ here })];
  }
}*/

macro (&) {
	case {_ $func:ident $args:arg ...} => {
		return #{
			$func($args (,) ...)
		}
	}
}

export (&)
